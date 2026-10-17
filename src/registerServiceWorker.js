// Registers the offline-support service worker (public/sw.js).
// Skipped in development and inside the native Capacitor app, which already bundles its files.
const isNativeApp = () =>
  Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production' && !isNativeApp()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .catch((err) => console.warn('Service worker registration failed:', err));
  });
}
