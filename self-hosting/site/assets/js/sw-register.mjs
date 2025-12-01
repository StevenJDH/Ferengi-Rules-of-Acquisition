/**
 * ES Module: Service Worker Register with Lifecycle Tracking
 *
 * Features:
 * - Registers a service worker using the specified path.
 * - Skips registration for 'localhost' by default, or the host passed via the 'excludeHost' option.
 * - Optionally logs service worker lifecycle events, including updates, which is enabled by default.
 */

export function registerServiceWorker(path, options = {}) {
  const {
    excludeHost = "localhost",
    verbose = true
  } = options;

  if (window.location.hostname === excludeHost) return;
  if (!("serviceWorker" in navigator)) return;

  let lastWorker = null; // Prevents duplicate tracking.

  navigator.serviceWorker.register(path)
    .then(reg => {
      trackWorker(reg.installing);
      reg.onupdatefound = () => trackWorker(reg.installing);
    })
    .catch(err => console.error("Service Worker registration failed:", err));

  // Reliably logs all lifecycle changes of the worker.
  function trackWorker(worker) {
    if (!verbose || !worker || worker === lastWorker) return;
    lastWorker = worker;
    console.log("Tracking new worker:", worker);
    worker.onstatechange = () => console.log("Service Worker state:", worker.state);
  }
}
