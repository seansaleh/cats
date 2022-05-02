import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
import { registerRoute } from 'workbox-routing';
import { CacheOnly } from 'workbox-strategies';

registerRoute(
    ({ url, event }) => {
        return (url.pathname === '/assets/generated-background.svg');
    },
    new CacheOnly({
        cacheName: "generated-backgrounds"
    })
);

setupRouting();

const urlsToCache = getFiles();
setupPrecaching(urlsToCache);