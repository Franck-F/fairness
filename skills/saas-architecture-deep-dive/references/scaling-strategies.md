# Scaling Strategies para SaaS

## Tipos de Scaling

### Vertical Scaling (Scale Up)

```
Antes:           Despues:
┌─────────┐      ┌─────────┐
│ 2 CPU   │      │ 8 CPU   │
│ 4GB RAM │  ──▶ │ 32GB RAM│
│ Server  │      │ Server  │
└─────────┘      └─────────┘
```

**Cuando usar:**
- Quick win para problemas inmediatos
- Database servers (mas facil que horizontal)
- Antes de invertir en refactoring

**Limites:**
- Hay un maximo de hardware
- Single point of failure
- Downtime para upgrade

---

### Horizontal Scaling (Scale Out)

```
Antes:           Despues:
┌─────────┐      ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Server  │      │ Server  │ │ Server  │ │ Server  │
└─────────┘      └─────────┘ └─────────┘ └─────────┘
     │                │           │           │
     │                └───────────┼───────────┘
     │                            │
     │                     ┌─────────────┐
     │                     │ Load        │
     │                     │ Balancer    │
     │                     └─────────────┘
```

**Cuando usar:**
- Application servers (stateless)
- Read-heavy workloads (read replicas)
- Necesitas alta disponibilidad

**Requisitos:**
- Aplicacion stateless
- Session storage externo (Redis)
- Load balancer configurado

---

## Estrategias por Componente

### Application Layer

```javascript
// Requisito 1: Stateless
// Mover sessions a Redis
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false
}));

// Requisito 2: Health checks
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

// Requisito 3: Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await redisClient.quit();
    await db.destroy();
    process.exit(0);
  });
});
```

---

### Database Layer

**Read Replicas:**
```
┌─────────────┐
│   Primary   │◀──── Writes
│  (Master)   │
└─────────────┘
      │
      │ Replication
      ▼
┌─────────────┐     ┌─────────────┐
│  Replica 1  │     │  Replica 2  │◀──── Reads
└─────────────┘     └─────────────┘
```

```javascript
// Knex config con read replicas
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_PRIMARY_HOST,
    // ... otros params
  },
  replication: {
    read: [
      { host: process.env.DB_REPLICA_1 },
      { host: process.env.DB_REPLICA_2 }
    ],
    write: { host: process.env.DB_PRIMARY_HOST }
  }
});

// Forzar lectura de primary cuando necesitas consistencia
const getUser = async (id, { consistent = false } = {}) => {
  const query = db('users').where({ id });
  if (consistent) {
    return query.connection(db.client.config.connection); // Primary
  }
  return query; // Replica
};
```

**Connection Pooling:**
```javascript
// PgBouncer o pool en aplicacion
const pool = new Pool({
  max: 20, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Monitoring de pool
setInterval(() => {
  console.log({
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount
  });
}, 60000);
```

---

### Cache Layer

```
Request Flow con Cache:
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Client  │────▶│   App   │────▶│  Redis  │────▶│   DB    │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                     │               │
                     │  Cache Hit    │
                     │◀──────────────┘
```

```javascript
// Cache-aside pattern
const getProduct = async (id) => {
  const cacheKey = `product:${id}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Miss - get from DB
  const product = await db('products').where({ id }).first();

  // Store in cache
  await redis.setex(cacheKey, 3600, JSON.stringify(product)); // 1 hour TTL

  return product;
};

// Invalidation on update
const updateProduct = async (id, data) => {
  await db('products').where({ id }).update(data);
  await redis.del(`product:${id}`);
};
```

**Cache Strategy por Tipo de Dato:**
```
| Dato              | TTL      | Invalidation    |
|-------------------|----------|-----------------|
| User profile      | 5 min    | On update       |
| Product catalog   | 1 hour   | On update       |
| Feature flags     | 10 min   | Manual trigger  |
| Session           | 24 hours | On logout       |
| Rate limit        | 1 min    | Auto-expire     |
```

---

### Queue-Based Scaling

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│   API   │────▶│  Queue  │────▶│ Workers │
└─────────┘     │ (Redis/ │     │ (N)     │
                │  SQS)   │     └─────────┘
                └─────────┘
```

```javascript
// Producer (API)
const sendNotification = async (userId, message) => {
  await queue.add('notifications', {
    userId,
    message,
    timestamp: Date.now()
  });

  return { status: 'queued' };
};

// Consumer (Worker)
queue.process('notifications', async (job) => {
  const { userId, message } = job.data;

  const user = await getUser(userId);

  await Promise.all([
    sendEmail(user.email, message),
    sendPush(user.pushToken, message),
    sendSMS(user.phone, message)
  ]);
});
```

**Scaling Workers:**
```bash
# Escalar workers independientemente
docker-compose up --scale worker=5

# O en Kubernetes
kubectl scale deployment notification-worker --replicas=10
```

---

## Database Sharding

**Cuando necesitas sharding:**
- Tabla > 100GB
- Queries lentas incluso con indices
- Write bottleneck en primary

**Sharding por Tenant (para SaaS):**
```
┌─────────────┐
│   Router    │
└─────────────┘
      │
      ├── tenant_a-z    ──▶ Shard 1
      ├── tenant_aa-az  ──▶ Shard 2
      └── tenant_ba-zz  ──▶ Shard 3
```

```javascript
// Shard router simple
const getShardConnection = (tenantId) => {
  const shardKey = tenantId.charCodeAt(0) % NUM_SHARDS;
  return shardConnections[shardKey];
};

// Query con shard
const getOrders = async (tenantId) => {
  const conn = getShardConnection(tenantId);
  return conn('orders').where({ tenant_id: tenantId });
};
```

**Problemas de Sharding:**
- Cross-shard queries son complejas
- Transactions cross-shard casi imposibles
- Rebalancing es doloroso
- Joins solo dentro del shard

---

## Monitoring para Scaling

```javascript
// Metricas clave
const metrics = {
  // Application
  requestLatency: histogram('http_request_duration_seconds'),
  activeConnections: gauge('active_connections'),
  errorRate: counter('http_errors_total'),

  // Database
  queryDuration: histogram('db_query_duration_seconds'),
  connectionPoolUsage: gauge('db_pool_usage'),

  // Cache
  cacheHitRate: gauge('cache_hit_rate'),

  // Queue
  queueDepth: gauge('queue_depth'),
  processingTime: histogram('job_processing_seconds')
};

// Alertas
if (metrics.requestLatency.p99 > 500) {
  alert('P99 latency too high - consider scaling');
}

if (metrics.connectionPoolUsage > 0.8) {
  alert('Connection pool near capacity');
}

if (metrics.queueDepth > 1000) {
  alert('Queue backing up - scale workers');
}
```

---

## Checklist de Scaling

```
PRE-SCALING
[ ] Identificar bottleneck real (profile first!)
[ ] Metricas de baseline establecidas
[ ] Aplicacion es stateless
[ ] Database tiene indices apropiados

HORIZONTAL SCALING
[ ] Load balancer configurado
[ ] Health checks implementados
[ ] Session storage externalizado
[ ] Graceful shutdown implementado

DATABASE SCALING
[ ] Connection pooling configurado
[ ] Read replicas si read-heavy
[ ] Indices revisados
[ ] Slow query log habilitado

CACHE
[ ] Redis/Memcached configurado
[ ] Cache invalidation strategy
[ ] TTLs apropiados
[ ] Cache warming si necesario

ASYNC
[ ] Jobs largos en queue
[ ] Workers escalables
[ ] Dead letter queue
[ ] Monitoring de queue depth
```
