import { API_BASE_URL } from './config.js';

const PREMIUM_KEY = 'bq_premium';

// Premium flag lives in localStorage (per device). It is only ever set after the
// backend confirms with Stripe that the checkout session was actually paid.
export function readPremium() {
  try {
    return localStorage.getItem(PREMIUM_KEY) === '1';
  } catch {
    return false;
  }
}

export function savePremium() {
  try {
    localStorage.setItem(PREMIUM_KEY, '1');
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
