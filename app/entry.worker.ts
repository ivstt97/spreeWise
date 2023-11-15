/// <reference lib="WebWorker" />

import { Storage } from '@remix-pwa/cache';
import { cacheFirst, networkFirst } from '@remix-pwa/strategy';
import type { DefaultFetchHandler } from '@remix-pwa/sw';
import { PrecacheHandler, logger, matchRequest } from '@remix-pwa/sw';

declare let self: ServiceWorkerGlobalScope;

const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v4';

const dataCache = Storage.open(dynamicCacheName, {
  ttl: 60 * 60 * 24 * 7 * 1_000, // 7 days
});

const documentCache = Storage.open(staticCacheName);

const assetsCache = Storage.open('assets-cache', {
  ttl: 60 * 60 * 24 * 30 * 1_000, // 30 days
});

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('Service worker installed');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  logger.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

const dataHandler = networkFirst({
  cache: dataCache,
});

const assetsHandler = cacheFirst({
  cache: assetsCache,
  cacheQueryOptions: {
    ignoreSearch: true,
    ignoreVary: true,
  },
});

export const defaultFetchHandler: DefaultFetchHandler = ({ context, request }) => {
  const type = matchRequest(request);

  if (type === 'asset') {
    return assetsHandler(context.event.request);
  }

  if (type === 'loader') {
    return dataHandler(context.event.request);
  }

  return context.fetchFromServer();
};

const handler = new PrecacheHandler({
  dataCache,
  documentCache,
  assetCache: assetsCache,
  state: {
    ignoredRoutes: [],
  },
});

self.addEventListener('message', (event) => {
  event.waitUntil(handler.handle(event));
});
