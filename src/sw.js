import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

registerRoute(
    (input) => {
        if(input.sameOrigin) {
            // Do not cache our own website. Let our precaching handle that!
            return false;
        }
        if (input.request.destination === 'image') {
            return true;
        }
        return false;
    },
    new CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200, 302, 301],
            }),
        ],
    })
);

setupRouting();
const urlsToCache = getFiles();
urlsToCache.push({ url: '/favicon.ico', revision: null });
setupPrecaching(urlsToCache);
