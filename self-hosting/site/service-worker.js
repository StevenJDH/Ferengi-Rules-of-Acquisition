---
# Using front matter to enable Jekyll processing on this file
# to avoid path relativity issues when using locally or remotely.
---
/**
 * A2HA Service Worker for a GitHub Pages Site
 *
 * Features:
 * - Pre-caches core assets listed in ASSETS during install to guarantee offline availability.
 * - Runtime caching for all other HTTP(S) requests as user visits pages (dynamic caching).
 * - Implements Stale-While-Revalidate pattern: serves cached responses immediately, and updates cache in background.
 * - Eager update strategy: skipWaiting() + clients.claim() ensures new SW activates and controls pages immediately.
 * - Automatically removes old caches during activation, keeping only the current CACHE version.
 * - Handles fetch safely: clones responses before caching, ignores non-HTTP(S) requests, provides offline fallback.
 */

const CACHE = "__GIT_SHA__";

// For pre-caching. Optionally, list all files for full offline support when installing.
const ASSETS = [
  "{{ '/' | relative_url }}",
  "{{ '/index.html' | relative_url }}",
  "{{ '/assets/css/custom.css' | relative_url }}",
  "{{ '/assets/data/rules.json' | relative_url }}",
  "{{ '/assets/icons/favicon-192.png' | relative_url }}",
  "{{ '/assets/icons/favicon.ico' | relative_url }}",
  "{{ '/assets/icons/site.webmanifest' | relative_url }}",
  "{{ '/assets/images/ferengi-cover.jpg' | relative_url }}",
  "{{ '/assets/js/rules-filter.js' | relative_url }}"
];

// Pre-cache assets during installation.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Removes old caches and ensures new service worker takes control immediately.
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Intercept fetch requests for run-time caching.
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  // Only handle http(s) requests, ignore chrome-extension://, etc.
  if (url.protocol.startsWith("http")) {
    event.respondWith(handleRequest(event.request));
  }
});

async function handleRequest(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) {
    fetchAndCacheAsync(request, cache); // Update in background.
    return cached;
  }
  return fetchAndCacheAsync(request, cache);
}

async function fetchAndCacheAsync(request, cache) {
  try {
    const response = await fetch(request);
    if (response && response.ok) { // All 2xx responses.
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return cache.match(request); // Fallback to cache if network fails.
  }
}
