// Optional parent account (Google sign-in via Firebase) to sync Premium + progress across devices.
// Stays completely off unless the REACT_APP_FIREBASE_* settings are provided at build time.
import { API_BASE_URL } from './config.js';
import { readPremium, readRestoreCode, savePremium } from './premium.js';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const accountsEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

// Firebase is loaded on demand so visitors who never sign in don't download it.
let authPromise = null;
function loadAuth() {
  if (!authPromise) {
    authPromise = Promise.all([import('firebase/app'), import('firebase/auth')]).then(([appMod, authMod]) => {
      const app = appMod.getApps().length ? appMod.getApps()[0] : appMod.initializeApp(firebaseConfig);
      return { auth: authMod.getAuth(app), mod: authMod };
    });
  }
  return authPromise;
}

// Calls back with the signed-in user (or null). Resolves to an unsubscribe function.
export async function watchUser(callback) {
  if (!accountsEnabled) {
    callback(null);
    return () => {};
  }
  const { auth, mod } = await loadAuth();
  return mod.onAuthStateChanged(auth, callback);
}

export async function signIn() {
  const { auth, mod } = await loadAuth();
  await mod.signInWithPopup(auth, new mod.GoogleAuthProvider());
}

export async function signOutUser() {
  const { auth, mod } = await loadAuth();
  await mod.signOut(auth);
}

async function getToken() {
  const { auth } = await loadAuth();
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
}

// Read this device's progress from the same keys the rest of the app writes.
export function collectProgress() {
  try {
    const keys = Object.keys(localStorage);
    const idsFor = (prefix) => keys.filter((k) => k.startsWith(prefix)).map((k) => k.slice(prefix.length));
    const highScores = {};
    keys
      .filter((k) => k.startsWith('quizHighScore_'))
      .forEach((k) => {
        highScores[k.slice('quizHighScore_'.length)] = parseInt(localStorage.getItem(k), 10) || 0;
      });
    return {
      stories: idsFor('storyCompleted_'),
      quizzes: idsFor('quizCompleted_'),
      highScores,
      streakCount: parseInt(localStorage.getItem('streakCount') || '0', 10) || 0,
      lastVisit: localStorage.getItem('lastVisit') || '',
      dailyChallengeCount: parseInt(localStorage.getItem('dailyChallengeCount') || '0', 10) || 0,
      weeklyGoal: localStorage.getItem('weeklyGoal') || '',
    };
  } catch {
    return {};
  }
}

// Write merged progress back to this device.
export function applyProgress(p) {
  if (!p) return;
  try {
    (p.stories || []).forEach((id) => localStorage.setItem(`storyCompleted_${id}`, 'true'));
    (p.quizzes || []).forEach((id) => localStorage.setItem(`quizCompleted_${id}`, 'true'));
    Object.entries(p.highScores || {}).forEach(([id, score]) =>
      localStorage.setItem(`quizHighScore_${id}`, String(score))
    );
    if (p.streakCount) localStorage.setItem('streakCount', String(p.streakCount));
    if (p.lastVisit) localStorage.setItem('lastVisit', p.lastVisit);
    if (p.dailyChallengeCount) localStorage.setItem('dailyChallengeCount', String(p.dailyChallengeCount));
    if (p.weeklyGoal) localStorage.setItem('weeklyGoal', p.weeklyGoal);
  } catch {
    /* storage unavailable: nothing to apply to */
  }
}

// Link any purchase made on this device, merge progress both ways, and report Premium status.
export async function syncAccount() {
  const token = await getToken();
  if (!token) return { premium: false };
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // A device that already bought Premium attaches that purchase to the account.
  const code = readRestoreCode();
  if (readPremium() && code) {
    await fetch(`${API_BASE_URL}/api/account/premium`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ sessionId: code }),
    }).catch(() => {});
  }

  const progressRes = await fetch(`${API_BASE_URL}/api/account/progress`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ progress: collectProgress() }),
  });
  if (!progressRes.ok) throw new Error('progress sync failed');
  applyProgress((await progressRes.json()).progress);

  const accountRes = await fetch(`${API_BASE_URL}/api/account`, { headers });
  if (!accountRes.ok) throw new Error('account load failed');
  const account = await accountRes.json();
  if (account.premium) savePremium();
  return { premium: account.premium === true };
}
