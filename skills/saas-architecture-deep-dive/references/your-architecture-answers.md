# Como Explicar Tu Arquitectura

Scripts para defender decisiones arquitectonicas de HostelOS y Digitaliza.

## HostelOS - Arquitectura Completa

### Diagrama de Alto Nivel

```
                    ┌─────────────────────────────────────┐
                    │           HOSTELOS                  │
                    └─────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│   React     │────▶│   Nginx     │────▶│    Node.js API      │
│   SPA       │     │  (proxy)    │     │    (Express)        │
└─────────────┘     └─────────────┘     └─────────────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
             ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
             │ PostgreSQL  │          │   Redis     │          │  External   │
             │ (data)      │          │  (cache,    │          │   APIs      │
             │             │          │   sessions) │          │             │
             └─────────────┘          └─────────────┘          └─────────────┘
                                                                     │
                                              ┌──────────────────────┼──────┐
                                              │                      │      │
                                              ▼                      ▼      ▼
                                        ┌─────────┐           ┌──────┐ ┌──────┐
                                        │ Stripe  │           │iCal  │ │Email │
                                        │ (pagos) │           │(OTAs)│ │(SMTP)│
                                        └─────────┘           └──────┘ └──────┘
```

### Pregunta: "Por que esta arquitectura?"

```
"Elegí separación API-first por varias razones:

1. DEPLOYS INDEPENDIENTES
   Frontend y backend pueden deployarse por separado. Un fix de CSS
   no requiere reiniciar el server.

2. ESCALABILIDAD FUTURA
   Si mañana necesito una app mobile, la API ya esta lista. Solo
   construyo el cliente.

3. MANTENIBILIDAD
   Codigo frontend y backend claramente separado. Mas facil de
   testear y debuggear.

No use microservicios porque:
- Soy un solo developer
- El overhead operacional no se justifica
- La complejidad del dominio no lo requiere

Es un 'modular monolith': una aplicacion, pero con separacion clara
de concerns internamente."
```

### Pregunta: "Explica la multi-tenancy"

```
"Use modelo pool con tenant_id en cada tabla. Funciona asi:

1. AUTENTICACION
   Usuario hace login, JWT incluye tenant_id

2. MIDDLEWARE
   Cada request extrae tenant_id del JWT y lo inyecta en el contexto

3. QUERY BUILDER
   Todas las queries automaticamente agregan WHERE tenant_id = ?

4. SAFETY NET
   PostgreSQL Row Level Security como backup por si algo falla

Ejemplo de flujo:
- Request: GET /api/reservations
- Middleware: req.tenantId = 'hostel_123'
- Query: SELECT * FROM reservations WHERE tenant_id = 'hostel_123'

Porque no silo (database per tenant)?
- Hostales son negocios pequenos, no pagan premium
- Datos no son ultra-sensibles (reservas, no historiales medicos)
- Costo de multiples DBs no se justifica"
```

### Pregunta: "Como funciona la sincronizacion con OTAs?"

```
"iCal es un protocolo de los 90s que solo tiene bloques de tiempo.
El challenge fue convertir eso en reservas con estados.

ARQUITECTURA:

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Internal   │◀───▶│    Sync     │◀───▶│    OTA      │
│  Database   │     │   Engine    │     │  (Booking)  │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
             ┌─────────────┐  ┌─────────────┐
             │  Sync Log   │  │  Conflict   │
             │             │  │  Queue      │
             └─────────────┘  └─────────────┘

FLUJO:

1. POLLING (cada 5 min)
   Fetcher descarga iCal de cada OTA

2. PARSING
   Convierte bloques iCal a objetos de reserva

3. RECONCILIACION
   Compara con estado interno:
   - Nuevo bloque → crear reserva
   - Bloque eliminado → cancelar reserva
   - Bloque modificado → actualizar reserva

4. CONFLICT RESOLUTION
   Si hay conflicto (ej: ya existe reserva interna en esa fecha):
   - Internal system es source of truth
   - Se notifica al usuario
   - Se loguea para audit

5. RETRY LOGIC
   Si API de OTA falla:
   - Exponential backoff: 1s, 2s, 4s, 8s, 16s
   - Max 5 intentos
   - Dead letter queue para failures persistentes

RESULTADO:
18 meses en produccion, cero overbookings. El 99% de syncs son
automaticos, solo conflictos reales requieren intervencion."
```

### Pregunta: "Que harias diferente?"

```
"Tres cosas:

1. TESTING DESDE DIA 1
   Empece sin tests y despues fue doloroso agregarlos. El sync engine
   especialmente deberia tener cobertura completa.

2. SEPARAR SYNC COMO SERVICIO
   Esta acoplado al monolito. Deberia ser independiente para poder
   escalarlo y deployarlo separadamente.

3. EVENT-DRIVEN ARCHITECTURE
   Muchas operaciones (notificaciones, reportes, sync) se beneficiarian
   de un event bus. Actualmente son llamadas directas."
```

---

## Digitaliza - Arquitectura

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                       DIGITALIZA                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────────────────┐
│  Public     │     │   Vercel    │     │    Static Sites         │
│  Pages      │────▶│   Edge      │────▶│    (per tenant)         │
│  (menus)    │     │   CDN       │     │                         │
└─────────────┘     └─────────────┘     └─────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────────────────┐
│   Admin     │────▶│   API       │────▶│    Supabase             │
│   Dashboard │     │   (Node)    │     │    (DB + Auth)          │
└─────────────┘     └─────────────┘     └─────────────────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │   Stripe    │
                    │   Connect   │
                    └─────────────┘
```

### Pregunta: "Por que Supabase y no PostgreSQL directo?"

```
"Supabase me dio varias cosas gratis:

1. AUTH
   Sistema de autenticacion completo, social logins, JWT

2. ROW LEVEL SECURITY
   Policies de seguridad a nivel de DB

3. REAL-TIME
   Subscriptions para updates en vivo del dashboard

4. STORAGE
   Para imagenes de productos sin configurar S3

Para una startup con un developer, esto acelero desarrollo
significativamente. Si escalara a millones de usuarios, migraria
a PostgreSQL managed, pero para validacion de producto es perfecto."
```

### Pregunta: "Como optimizaste para mobile?"

```
"82% del trafico viene de mobile, muchos con conexiones 3G lentas.

OPTIMIZACIONES:

1. STATIC GENERATION
   Menus son pre-renderizados como HTML estatico
   No JS necesario para ver el menu

2. EDGE CACHING
   CDN sirve desde el edge mas cercano
   TTL de 1 hora (menus no cambian cada segundo)

3. IMAGE OPTIMIZATION
   - WebP con fallback a JPEG
   - srcset para diferentes resoluciones
   - Lazy loading para imagenes below-fold

4. MINIMAL JS
   - Solo vanilla JS para interactividad minima
   - No React en paginas publicas
   - Total JS < 20KB

5. CRITICAL CSS INLINE
   - CSS above-fold inline en HTML
   - Resto cargado async

RESULTADO:
- LCP < 2s en 3G
- Lighthouse score: 94
- Works offline con service worker"
```

### Pregunta: "Como manejas Stripe en Colombia?"

```
"Colombia tiene dos particularidades:

1. NO HAY CENTAVOS
   50,000 COP se envia a Stripe como 5,000,000 (x100)
   Tengo conversion layer que maneja esto transparentemente

2. STRIPE CONNECT LIMITADO
   No hay Stripe Billing automatico en Colombia
   Construi mi propio sistema de subscriptions sobre Stripe Payments

FLUJO DE PAGO:

1. Usuario elige plan
2. Frontend crea PaymentIntent via API
3. Stripe Elements renderiza form de pago
4. Pago se procesa
5. Webhook confirma y activa subscription
6. Cron job verifica renovaciones mensuales

Es mas manual que Stripe Billing en USA, pero funciona bien para
el volumen actual."
```

---

## Trade-offs Comunes: Como Defenderlos

### "Por que no microservicios?"

```
"La pregunta correcta es: que problema resuelven microservicios que
tengo?

Microservicios son utiles cuando:
- Equipos diferentes trabajan en partes diferentes
- Partes del sistema escalan muy diferente
- Necesitas deployar partes independientemente con alto riesgo

En mi caso:
- Soy un solo developer
- Todo escala similar
- Puedo deployar todo junto sin riesgo

El overhead de microservicios (service discovery, network latency,
distributed transactions, deployment complexity) no se justifica.

Cuando SI los usaria: si tuviera un equipo de 10+ developers y
partes del sistema con escala muy diferente."
```

### "Por que PostgreSQL y no MongoDB?"

```
"Los datos son altamente relacionales:
- Reservas pertenecen a habitaciones
- Habitaciones pertenecen a propiedades
- Propiedades pertenecen a tenants
- Pagos relacionan reservas con huespedes

En MongoDB, tendria que:
- Denormalizar agresivamente
- Mantener consistencia manualmente
- Escribir codigo para hacer 'joins'

PostgreSQL me da:
- JOINs nativos
- Transactions ACID
- Constraints de integridad
- Row Level Security para multi-tenancy

MongoDB hubiera sido mejor para:
- Logs (schema variable)
- Analytics (documents independientes)
- Datos no relacionales

Pero el core del negocio es relacional."
```

### "Por que no GraphQL?"

```
"Para el tamaño actual del proyecto, REST es suficiente y mas simple.

GraphQL brilla cuando:
- Frontend necesita flexibilidad en queries
- Hay muchos clientes con necesidades diferentes
- Over/under-fetching es un problema real

En mi caso:
- Un solo frontend
- Endpoints diseñados para las vistas exactas
- No hay problema de fetching

Si agregara mobile app con necesidades diferentes, consideraria
GraphQL. Pero para web-only, REST + endpoints bien diseñados
funciona perfectamente."
```

---

## Script para Cerrar Discusion Arquitectonica

```
"En resumen, mis decisiones arquitectonicas se basan en:

1. PRAGMATISMO
   Usar la solucion mas simple que resuelve el problema actual

2. ESCALA APROPIADA
   No sobre-diseñar para millones de usuarios cuando tengo cientos

3. EVOLUCION
   Arquitectura que puede crecer sin rewrite completo

4. CONTEXTO
   Como desarrollador individual, optimizo para productividad y
   mantenibilidad, no para escala de Facebook

Si el sistema necesita escalar 100x, hay caminos claros:
- Read replicas para queries
- Cache mas agresivo
- Separar servicios criticos
- Queue para operaciones async

Pero eso se hace cuando se necesita, no preventivamente."
```
