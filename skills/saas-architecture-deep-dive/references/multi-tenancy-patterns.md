# Multi-Tenancy Patterns en Profundidad

## Los 3 Modelos Principales

### 1. SILO (Database per Tenant)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Tenant A   │     │  Tenant B   │     │  Tenant C   │
│  Database   │     │  Database   │     │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                    ┌─────────────┐
                    │ Application │
                    │   Layer     │
                    └─────────────┘
```

**Pros:**
- Isolation total de datos
- Compliance facil (HIPAA, GDPR)
- Backup/restore por tenant independiente
- Sin riesgo de data leaks accidentales
- Performance predecible por tenant

**Cons:**
- Costo alto (una DB por tenant)
- Migrations complejas (aplicar a todas las DBs)
- Connection management complejo
- No escala bien a miles de tenants

**Implementacion:**
```javascript
// Connection pool por tenant
const connections = new Map();

const getConnection = async (tenantId) => {
  if (!connections.has(tenantId)) {
    const conn = await createConnection({
      host: `${tenantId}.db.example.com`,
      database: `tenant_${tenantId}`
    });
    connections.set(tenantId, conn);
  }
  return connections.get(tenantId);
};

// En cada request
app.use(async (req, res, next) => {
  const tenantId = extractTenant(req);
  req.db = await getConnection(tenantId);
  next();
});
```

**Cuando usar:**
- Healthcare (HIPAA)
- Financial services (datos sensibles)
- Enterprise clients que pagan por isolation
- Menos de 100 tenants

---

### 2. POOL (Shared Database, tenant_id column)

```
┌─────────────────────────────────────────┐
│           Shared Database               │
│  ┌─────────────────────────────────┐   │
│  │ users                            │   │
│  │ id | tenant_id | email | name   │   │
│  │ 1  | tenant_a  | a@... | Alice  │   │
│  │ 2  | tenant_b  | b@... | Bob    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ orders                           │   │
│  │ id | tenant_id | user_id | ...  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Pros:**
- Simple de implementar
- Costo muy bajo (una DB)
- Migrations faciles
- Escala a miles de tenants

**Cons:**
- Riesgo de data leaks si olvidas el WHERE
- "Noisy neighbor" problem
- Backup es todo o nada
- Compliance mas dificil de demostrar

**Implementacion:**
```javascript
// Middleware que inyecta tenant
app.use((req, res, next) => {
  const tenantId = extractTenant(req);
  req.tenantId = tenantId;
  next();
});

// Query builder con tenant automatico
class TenantAwareQuery {
  constructor(tenantId) {
    this.tenantId = tenantId;
  }

  find(table, conditions = {}) {
    return db(table)
      .where({ ...conditions, tenant_id: this.tenantId });
  }

  insert(table, data) {
    return db(table)
      .insert({ ...data, tenant_id: this.tenantId });
  }
}

// Row Level Security en PostgreSQL (backup)
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.tenant_id'));

-- En cada request
SET app.tenant_id = 'tenant_123';
```

**Cuando usar:**
- SaaS general (Digitaliza, HostelOS)
- Muchos tenants pequenos
- Budget limitado
- Datos no ultra-sensibles

---

### 3. BRIDGE (Schema per Tenant)

```
┌─────────────────────────────────────────┐
│           Shared Database               │
│  ┌─────────────┐  ┌─────────────┐      │
│  │ tenant_a    │  │ tenant_b    │      │
│  │ schema      │  │ schema      │      │
│  │ ├─ users    │  │ ├─ users    │      │
│  │ ├─ orders   │  │ ├─ orders   │      │
│  │ └─ ...      │  │ └─ ...      │      │
│  └─────────────┘  └─────────────┘      │
│  ┌─────────────────────────────────┐   │
│  │ public schema (shared data)     │   │
│  │ ├─ plans                        │   │
│  │ ├─ features                     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Pros:**
- Balance isolation/costo
- Un backup puede restaurar un tenant
- Mejor que pool para compliance
- No necesita tenant_id en cada tabla

**Cons:**
- Connection management complejo
- Migrations a multiples schemas
- Limite practico de schemas por DB
- Mas complejo que pool

**Implementacion:**
```javascript
// Search path por tenant en PostgreSQL
const setTenantSchema = async (conn, tenantId) => {
  await conn.raw(`SET search_path TO tenant_${tenantId}, public`);
};

// Crear schema para nuevo tenant
const createTenantSchema = async (tenantId) => {
  await db.raw(`CREATE SCHEMA tenant_${tenantId}`);

  // Copiar estructura de template
  await db.raw(`
    CREATE TABLE tenant_${tenantId}.users (LIKE public.users_template INCLUDING ALL);
    CREATE TABLE tenant_${tenantId}.orders (LIKE public.orders_template INCLUDING ALL);
  `);
};
```

**Cuando usar:**
- Enterprise SaaS con compliance medio
- 100-1000 tenants
- Clientes que necesitan isolation demostrable
- Data portability requerida

---

## Decision Matrix

```
                    SILO        BRIDGE      POOL
Isolation           ★★★★★       ★★★☆☆       ★☆☆☆☆
Cost Efficiency     ★☆☆☆☆       ★★★☆☆       ★★★★★
Simplicity          ★★★☆☆       ★★☆☆☆       ★★★★★
Scalability         ★★☆☆☆       ★★★☆☆       ★★★★★
Compliance          ★★★★★       ★★★★☆       ★★☆☆☆
Query Performance   ★★★★★       ★★★★☆       ★★★☆☆
```

---

## Hibrido: Lo Mejor de Ambos Mundos

**Pattern: Pool + Silo por demanda**

```javascript
// Tenants normales en pool
// Enterprise tenants en silo

const getConnection = async (tenant) => {
  if (tenant.plan === 'enterprise' && tenant.dedicated_db) {
    return getDedicatedConnection(tenant.db_host);
  }
  return getSharedConnection();
};

const getTenantQuery = (tenant) => {
  if (tenant.dedicated_db) {
    return new Query(); // Sin tenant_id, DB es suya
  }
  return new TenantAwareQuery(tenant.id);
};
```

**Beneficios:**
- Mayoria de tenants en pool (costo bajo)
- Enterprise paga por silo (margin alto)
- Upgrade path claro para clientes
- Mismo codigo, diferente storage

---

## Tu Experiencia: Como Explicar

**HostelOS:**
```
"Use modelo pool con tenant_id en cada tabla. Para hostales pequenos,
el costo de database-per-tenant seria prohibitivo. Implemente:

1. Middleware que extrae tenant del JWT
2. Query builder que inyecta tenant_id automaticamente
3. PostgreSQL RLS como safety net
4. Indices compuestos (tenant_id, campo_frecuente)

El sistema soporta cientos de propiedades en una sola base de datos
sin problemas de performance."
```

**Digitaliza:**
```
"Mismo approach pool, optimizado para mas tenants. Agregue:

1. Cache Redis con namespace por tenant
2. Rate limiting por tenant para evitar noisy neighbor
3. Monitoring de queries por tenant para detectar outliers
4. Feature flags por plan (free, pro, enterprise)"
```

**Si preguntan sobre isolation:**
```
"Para el nivel de sensibilidad de estos datos (menus, reservas),
pool es suficiente. Si tuviera datos medicos o financieros, usaria
silo. La decision de arquitectura debe matchear el risk profile
del negocio."
```
