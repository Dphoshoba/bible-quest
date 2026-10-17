import { API_BASE_URL } from './config.js';

const PREMIUM_KEY = 'bq_premium';

// Shown to buyers before checkout. Must match PREMIUM_PRICE_CENTS on the backend (default 500).
export const PREMIUM_PRICE_LABEL = 'US$5.00 one-time payment';

// Premium flag lives in localStorage (per device). It is only ever set after the
// backend confirms with Stripe that the checkout session was actually paid.
export function readPremium() {
  try {
    return localStorage.getItem(PREMIUM_KEY) === '1';
  } catch {
    return false;
  }
}

const CODE_KEY = 'bq_premium_code';

// The Stripe session id doubles as a private "restore code": long, unguessable, and only
// ever shown to the buyer on the success page. Entering it on a new device re-verifies it.
export function readRestoreCode() {
  try {
    return localStorage.getItem(CODE_KEY) || '';
  } catch {
    return '';
  }
}

export async function restorePurchase(code) {
  const trimmed = String(code || '').trim();
  if (!/^cs_[A-Za-z0-9_]+$/.test(trimmed)) return false;
  const paid = await verifySession(trimmed);
  if (paid) savePremium(trimmed);
  return paid;
}

export function savePremium(code) {
  try {
    localStorage.setItem(PREMIUM_KEY, '1');
    if (code) localStorage.setItem(CODE_KEY, code);
  } catch {
    /* storage unavailable (private mode): premium lasts for this session only */
  }
}

export async function startCheckout() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
  } catch (err) {
    console.error('Checkout error:', err);
  }
  alert('Sorry, we could not start checkout. Please try again in a moment.');
}

export async function verifySession(sessionId) {
  const res = await fetch(
    `${API_BASE_URL}/api/verify-session?session_id=${encodeURIComponent(sessionId)}`
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.premium === true;
}
