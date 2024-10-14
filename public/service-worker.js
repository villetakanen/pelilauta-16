importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js',
);

// import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

workbox.precaching.cleanupOutdatedCaches();

let precache = self.__WB_MANIFEST;
if (!precache) precache = [{ revision: null, url: 'index.html' }];

workbox.precaching.precacheAndRoute(precache);
