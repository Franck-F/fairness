# Billing Integration con Stripe

## Subscription Lifecycle

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   TRIAL     │────▶│   ACTIVE    │────▶│  CANCELLED  │
│  (14 days)  │     │  (paying)   │     │  (churned)  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                    ▲
      │                   ▼                    │
      │             ┌─────────────┐            │
      └────────────▶│ PAST_DUE    │────────────┘
                    │ (payment    │
                    │  failed)    │
                    └─────────────┘
```

---

## Implementacion Basica

### 1. Crear Customer

```javascript
const createCustomer = async (user, tenant) => {
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      tenant_id: tenant.id,
      user_id: user.id
    }
  });

  await db('tenants')
    .where({ id: tenant.id })
    .update({ stripe_customer_id: customer.id });

  return customer;
};
```

### 2. Crear Subscription

```javascript
const createSubscription = async (tenant, priceId) => {
  // Asegurar que existe customer
  let customerId = tenant.stripe_customer_id;
  if (!customerId) {
    const customer = await createCustomer(tenant.owner, tenant);
    customerId = customer.id;
  }

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription'
    },
    expand: ['latest_invoice.payment_intent']
  });

  return {
    subscriptionId: subscription.id,
    clientSecret: subscription.latest_invoice.payment_intent.client_secret
  };
};
```

### 3. Frontend: Stripe Elements

```javascript
// React component
const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/subscription/success`
      }
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit">Subscribe</button>
    </form>
  );
};
```

---

## Webhook Handling

### Setup

```javascript
// Verificar firma SIEMPRE
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Procesar evento
  await processStripeEvent(event);

  res.json({ received: true });
};
```

### Eventos Importantes

```javascript
const processStripeEvent = async (event) => {
  const { type, data } = event;

  switch (type) {
    // Subscription creada/actualizada
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionChange(data.object);
      break;

    // Subscription cancelada
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(data.object);
      break;

    // Pago exitoso
    case 'invoice.paid':
      await handleInvoicePaid(data.object);
      break;

    // Pago fallido
    case 'invoice.payment_failed':
      await handlePaymentFailed(data.object);
      break;

    // Disputa abierta
    case 'charge.dispute.created':
      await handleDispute(data.object);
      break;
  }
};
```

### Handlers

```javascript
const handleSubscriptionChange = async (subscription) => {
  const tenantId = subscription.metadata.tenant_id;

  await db('tenants')
    .where({ id: tenantId })
    .update({
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      current_plan: subscription.items.data[0].price.lookup_key,
      current_period_end: new Date(subscription.current_period_end * 1000)
    });

  // Actualizar feature flags
  await syncFeatureFlags(tenantId, subscription.items.data[0].price.lookup_key);
};

const handlePaymentFailed = async (invoice) => {
  const tenantId = invoice.subscription_details?.metadata?.tenant_id;
  if (!tenantId) return;

  // Marcar como past_due
  await db('tenants')
    .where({ id: tenantId })
    .update({ subscription_status: 'past_due' });

  // Notificar al usuario
  await sendEmail(invoice.customer_email, 'payment_failed', {
    amount: invoice.amount_due / 100,
    retry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  });
};

const handleSubscriptionCancelled = async (subscription) => {
  const tenantId = subscription.metadata.tenant_id;

  await db('tenants')
    .where({ id: tenantId })
    .update({
      subscription_status: 'cancelled',
      current_plan: 'free' // Downgrade a free
    });

  // Downgrade features
  await syncFeatureFlags(tenantId, 'free');
};
```

---

## Idempotencia en Webhooks

```javascript
// Stripe puede enviar el mismo evento multiples veces
// SIEMPRE usar idempotency

const processStripeEvent = async (event) => {
  // Check si ya procesamos este evento
  const existing = await db('stripe_events')
    .where({ event_id: event.id })
    .first();

  if (existing) {
    console.log(`Event ${event.id} already processed`);
    return;
  }

  // Procesar evento
  await handleEvent(event);

  // Marcar como procesado
  await db('stripe_events').insert({
    event_id: event.id,
    type: event.type,
    processed_at: new Date()
  });
};
```

---

## Caso Especial: Colombia (COP)

```javascript
// Colombia no usa centavos, pero Stripe espera la unidad minima
// 50,000 COP = 5,000,000 en Stripe

const formatForStripe = (amount, currency) => {
  if (currency === 'COP') {
    // Stripe espera * 100 aunque COP no tenga centavos
    return Math.round(amount * 100);
  }
  // USD, EUR, etc. ya vienen en centavos
  return amount;
};

const formatFromStripe = (amount, currency) => {
  if (currency === 'COP') {
    return amount / 100;
  }
  return amount / 100; // Para display user-friendly
};

// Crear precio en COP
const createCOPPrice = async (amount, productId) => {
  return stripe.prices.create({
    product: productId,
    unit_amount: formatForStripe(amount, 'COP'), // 50000 -> 5000000
    currency: 'cop',
    recurring: { interval: 'month' }
  });
};
```

---

## Dunning Flow (Pagos Fallidos)

```
Dia 0: Pago falla
  → Email: "Tu pago fallo, actualizamos tu tarjeta"
  → Status: past_due
  → Features: siguen activas

Dia 3: Retry automatico (Stripe)
  → Si exitoso: status active
  → Si falla: segundo email

Dia 7: Segundo retry
  → Email mas urgente
  → Warning en app

Dia 14: Tercer retry
  → Email final
  → Features limitadas

Dia 21: Subscription cancelled
  → Downgrade a free
  → Email de win-back
```

```javascript
// Middleware para verificar status
const checkSubscriptionStatus = async (req, res, next) => {
  const tenant = req.tenant;

  if (tenant.subscription_status === 'past_due') {
    // Mostrar banner de warning pero permitir uso
    req.showPaymentWarning = true;
  }

  if (tenant.subscription_status === 'cancelled' &&
      tenant.current_plan !== 'free') {
    // Forzar downgrade si aun no se aplico
    await syncFeatureFlags(tenant.id, 'free');
  }

  next();
};
```

---

## Checklist de Billing

```
SETUP
[ ] Stripe account verificada
[ ] Webhook endpoint configurado
[ ] Webhook secret en env vars
[ ] Productos y precios creados en Stripe

INTEGRACION
[ ] Customer creation flow
[ ] Subscription creation flow
[ ] Payment element integrado
[ ] Webhook handlers para eventos clave

EDGE CASES
[ ] Idempotencia en webhooks
[ ] Dunning flow configurado
[ ] Manejo de disputes
[ ] Refunds flow
[ ] Currency handling (si multi-currency)

MONITORING
[ ] Logs de eventos Stripe
[ ] Alertas para payment failures
[ ] Dashboard de MRR/churn
```
