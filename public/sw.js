importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js',
);

//import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

cleanupOutdatedCaches();

// Precache the manifest
precacheAndRoute(self.__WB_MANIFEST);
