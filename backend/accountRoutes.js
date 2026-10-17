// backend/accountRoutes.js
// Parent accounts: Google sign-in (verified Firebase ID token) with Premium + progress sync.
import express from 'express';
import Stripe from 'stripe';
import { firebaseConfigured, getDb, verifyIdToken } from './firebase.js';

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const ID = /^[a-z0-9-]{1,40}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_IDS = 100;

const clampInt = (v, max) => Math.max(0, Math.min(max, Math.floor(Number(v) || 0)));

// Keep only well-formed, bounded values: this data comes from the browser.
export function sanitizeProgress(p) {
  const src = p && typeof p === 'object' ? p : {};
  const ids = (arr) =>
    [...new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === 'string' && ID.test(x)) : [])].slice(0, MAX_IDS);

  const highScores = {};
  if (src.highScores && typeof src.highScores === 'object') {
    for (const [k, v] of Object.entries(src.highScores).slice(0, MAX_IDS)) {
      if (ID.test(k)) highScores[k] = clampInt(v, 1000);
    }
  }

  return {
    stories: ids(src.stories),
    quizzes: ids(src.quizzes),
    highScores,
    streakCount: clampInt(src.streakCount, 100000),
    lastVisit: typeof src.lastVisit === 'string' && DATE.test(src.lastVisit) ? src.lastVisit : '',
    dailyChallengeCount: clampInt(src.dailyChallengeCount, 100000),
    weeklyGoal: typeof src.weeklyGoal === 'string' ? src.weeklyGoal.slice(0, 200) : '',
  };
}

// Never lose progress: union what was done, keep the best scores, keep the fresher streak.
export function mergeProgress(a, b) {
  const x = sanitizeProgress(a);
  const y = sanitizeProgress(b);

  const highScores = { ...x.highScores };
  for (const [k, v] of Object.entries(y.highScores)) highScores[k] = Math.max(highScores[k] || 0, v);

  let streakCount;
  if (x.lastVisit === y.lastVisit) streakCount = Math.max(x.streakCount, y.streakCount);
  else streakCount = x.lastVisit > y.lastVisit ? x.streakCount : y.streakCount;

  return {
    stories: [...new Set([...x.stories, ...y.stories])].slice(0, MAX_IDS),
    quizzes: [...new Set([...x.quizzes, ...y.quizzes])].slice(0, MAX_IDS),
    highScores,
    streakCount,
    lastVisit: x.lastVisit > y.lastVisit ? x.lastVisit : y.lastVisit,
    dailyChallengeCount: Math.max(x.dailyChallengeCount, y.dailyChallengeCount),
    weeklyGoal: y.weeklyGoal || x.weeklyGoal,
  };
}

async function requireUser(req, res, next) {
  if (!firebaseConfigured()) {
    return res.status(501).json({ error: 'Accounts are not configured on the server.' });
  }
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Please sign in.' });
  try {
    req.user = await verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Your sign-in has expired. Please sign in again.' });
  }
}

router.get('/api/account', requireUser, async (req, res) => {
  try {
    const snap = await getDb().collection('users').doc(req.user.uid).get();
    const data = snap.exists ? snap.data() : {};
    res.json({ premium: data.premium === true, progress: sanitizeProgress(data.progress) });
  } catch (err) {
    console.error('account get error:', err?.message || err);
    res.status(500).json({ error: 'Could not load your account.' });
  }
});

router.put('/api/account/progress', requireUser, async (req, res) => {
  try {
    const ref = getDb().collection('users').doc(req.user.uid);
    const merged = await getDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const stored = snap.exists ? snap.data().progress : {};
      const next = mergeProgress(stored, req.body?.progress);
      tx.set(ref, { progress: next, updatedAt: new Date().toISOString() }, { merge: true });
      return next;
    });
    res.json({ progress: merged });
  } catch (err) {
    console.error('account progress error:', err?.message || err);
    res.status(500).json({ error: 'Could not save your progress.' });
  }
});

// Attach a paid Premium purchase to this account. The payment is checked with Stripe,
// and one purchase can only ever belong to one account.
router.post('/api/account/premium', requireUser, async (req, res) => {
  if (!stripe) return res.status(501).json({ error: 'Payments are not configured.' });

  const sessionId = String(req.body?.sessionId || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return res.status(400).json({ error: 'Invalid restore code.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid' && session.metadata?.product === 'premium';
    if (!paid) return res.status(402).json({ error: 'That purchase could not be confirmed.' });

    const db = getDb();
    const claimRef = db.collection('premiumSessions').doc(sessionId);
    const userRef = db.collection('users').doc(req.user.uid);

    await db.runTransaction(async (tx) => {
      const claim = await tx.get(claimRef);
      if (claim.exists && claim.data().uid !== req.user.uid) {
        const err = new Error('claimed');
        err.code = 'CLAIMED';
        throw err;
      }
      tx.set(claimRef, { uid: req.user.uid, claimedAt: new Date().toISOString() });
      tx.set(userRef, { premium: true, premiumSessionId: sessionId }, { merge: true });
    });

    res.json({ premium: true });
  } catch (err) {
    if (err.code === 'CLAIMED') {
      return res.status(409).json({ error: 'That purchase is already linked to another account.' });
    }
    console.error('account premium error:', err?.message || err);
    res.status(500).json({ error: 'Could not link your purchase.' });
  }
});

export default router;
