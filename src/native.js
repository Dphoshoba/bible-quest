// True only inside the Android app (Capacitor). On the website this is always false:
// public/capacitor.js installs a web stand-in for window.Capacitor that has no isNativePlatform().
// Used to hide purchase and account features in the Android release (Premium is web-only).
export const isNativeApp = () =>
  typeof window !== 'undefined' &&
  Boolean(window.Capacitor) &&
  typeof window.Capacitor.isNativePlatform === 'function' &&
  window.Capacitor.isNativePlatform() === true;

// Premium inside the directly-installed Android app (Stripe checkout opens in the phone's browser,
// then the buyer pastes the restore code into the app). Google Play forbids taking payments this way,
// so a Play Store build must set REACT_APP_NATIVE_PREMIUM=off when running `npm run build`.
export const nativePremiumEnabled = process.env.REACT_APP_NATIVE_PREMIUM !== 'off';

// True only for a Play-Store-style build (switch off) running inside the native app.
export const purchasesHidden = () => isNativeApp() && !nativePremiumEnabled;
