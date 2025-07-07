import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import CONFIG from './config';

const BASE_URL = CONFIG.BASE_URL;

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({ cacheName: 'google-fonts' }),
);

registerRoute(
  ({ url }) => url.origin.includes('fontawesome') || url.origin === 'https://cdnjs.cloudflare.com',
  new CacheFirst({ cacheName: 'cdn-assets' }),
);

registerRoute(
  ({ url }) => url.origin.includes('ui-avatars.com'),
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
);

registerRoute(
  ({ request, url }) => {
    const base = new URL(BASE_URL);
    return url.origin === base.origin && request.destination === '';
  },
  new NetworkFirst({ cacheName: 'story-api-json' }),
);

registerRoute(
  ({ request, url }) => {
    const base = new URL(BASE_URL);
    return url.origin === base.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({ cacheName: 'story-api-images' }),
);

registerRoute(
  ({ url }) => url.origin.includes('maptiler'),
  new CacheFirst({ cacheName: 'maptiler-tiles' }),
);


self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received.');

  const data = event.data?.json();

  const title = data?.title || 'Dicoding Story';
  const options = {
    body: data?.options?.body || 'New story received!',
    icon: 'favicon.png',
    badge: 'favicon.png',
    data: {
      url: '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
