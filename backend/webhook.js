// backend/webhook.js

import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('Webhook: .env path =', envPath);
console.log('Webhook: STRIPE_SECRET_KEY exists =', !!process.env.STRIPE_SECRET_KEY);

const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey) {
  try {
    stripe = new Stripe(stripeKey);
  } catch (err) {
    console.error('Webhook: failed to initialize Stripe:', err?.message || err);
    stripe = null;
  }
} else {
  console.warn('Webhook: STRIPE_SECRET_KEY not set; webhook route will return 501.');
}

const router = express.Router();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Webhook route (mounted at /webhook)
router.post('/', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe || !endpointSecret) {
    console.warn('Webhook: Stripe or webhook secret not configured');
    return res.status(501).send('Webhook not configured on server.');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('✅ Payment received for:', session.customer_email);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;

