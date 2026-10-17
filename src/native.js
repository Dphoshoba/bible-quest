// True only inside the Android app (Capacitor). On the website this is always false:
// public/capacitor.js installs a web stand-in for window.Capacitor that has no isNativePlatform().
// Used to hide purchase and account features in the Android release (Premium is web-only).
export const isNativeApp = () =>
  typeof window !== 'undefined' &&
  Boolean(window.Capacitor) &&
  typeof window.Capacitor.isNativePlatform === 'function' &&
  window.Capacitor.isNativePlatform() === true;
