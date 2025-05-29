import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Debug: Check if .env file exists
const envPath = 'C:/Users/david/Desktop/bible-quest/backend/.env';
console.log('DonationRoutes: Looking for .env at:', envPath);
console.log('DonationRoutes: .env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  console.log('DonationRoutes: .env file contents:', fs.readFileSync(envPath, 'utf8'));
}

// Load .env from backend directory
dotenv.config({ path: envPath });

// Debug: Log environment variables
console.log('DonationRoutes: Environment variables loaded:');
console.log('DonationRoutes: STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('DonationRoutes: STRIPE_SECRET_KEY starts with:', process.env.STRIPE_SECRET_KEY?.substring(0, 7));

// Now import other modules
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// Validate Stripe key before creating instance
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('DonationRoutes: STRIPE_SECRET_KEY is not set in environment variables');
  throw new Error('STRIPE_SECRET_KEY is required but not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Test endpoint to verify Stripe configuration
router.get('/test-checkout', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: 100, // $1.00 for testing
          product_data: {
            name: 'Test Payment',
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3001/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3001/',
    });

    res.json({ 
      message: 'Checkout session created successfully',
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Stripe test error:', error);
    res.status(500).json({ 
      error: 'Stripe test failed',
      message: error.message
    });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: 500, // $5.00
          product_data: {
            name: 'Bible Quest Premium Access',
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3001/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3001/',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Stripe checkout session failed' });
  }
});

export default router;