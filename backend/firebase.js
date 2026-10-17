// backend/firebase.js
// Lazy Firebase Admin setup. Returns null helpers when Firebase isn't configured,
// so the rest of the server keeps working without it.
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

let initialised = false;
let configured = false;

function loadCredentials() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      return JSON.parse(json);
    } catch (err) {
      console.error('Firebase: FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
      return null;
    }
  }
  const file = resolve('./serviceAccountKey.json');
  if (existsSync(file)) {
    return JSON.parse(readFileSync(file, 'utf8'));
  }
  return null;
}

function init() {
  if (initialised) return configured;
  initialised = true;
  const credentials = loadCredentials();
  if (!credentials) {
    console.warn('Firebase: no service account configured; account features are disabled.');
    return false;
  }
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(credentials) });
  }
  configured = true;
  return true;
}

export function firebaseConfigured() {
  return init();
}

export function getDb() {
  return init() ? admin.firestore() : null;
}

// Throws if the token is missing, invalid or expired.
export async function verifyIdToken(token) {
  if (!init()) throw new Error('Firebase not configured');
  return admin.auth().verifyIdToken(token);
}
