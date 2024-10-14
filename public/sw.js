import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

cleanupOutdatedCaches();

// Precache the manifest
precacheAndRoute(self.__WB_MANIFEST);
