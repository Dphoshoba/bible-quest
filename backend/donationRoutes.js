import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// Lazy-create Stripe client only when key exists
const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey) {
  try {
    stripe = new Stripe(stripeKey);
  } catch (err) {
    console.error('DonationRoutes: failed to initialize Stripe:', err?.message || err);
    stripe = null;
  }
} else {
  console.warn('DonationRoutes: STRIPE_SECRET_KEY is not set. Checkout endpoints will be disabled.');
}

// Where Stripe sends the customer back to (the deployed frontend).
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
const PREMIUM_PRICE_CENTS = Number(process.env.PREMIUM_PRICE_CENTS) || 500;

const createCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(501).json({ error: 'Stripe not configured on server. Set STRIPE_SECRET_KEY.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: PREMIUM_PRICE_CENTS,
          product_data: { name: 'Bible Quest Premium Access' },
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: { product: 'premium' },
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Stripe checkout session failed' });
  }
};

// Both paths: the app config uses /api/..., older code used the bare path.
router.post('/create-checkout-session', createCheckoutSession);
router.post('/api/create-checkout-session', createCheckoutSession);

// After redirect from Stripe, the frontend asks us whether this session really was paid.
// Never trust the redirect alone — the session is looked up server-side.
router.get('/api/verify-session', async (req, res) => {
  if (!stripe) {
    return res.status(501).json({ error: 'Stripe not configured on server.' });
  }

  const sessionId = String(req.query.session_id || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return res.status(400).json({ error: 'Invalid session id.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const premium = session.payment_status === 'paid' && session.metadata?.product === 'premium';
    res.json({ premium });
  } catch (error) {
    console.error('Stripe verify error:', error?.message || error);
    res.status(404).json({ premium: false });
  }
});

export default router;
