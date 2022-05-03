import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
import { registerRoute } from 'workbox-routing';
import { CacheOnly } from 'workbox-strategies';

setupRouting();
setupPrecaching(getFiles());

registerRoute(
    ({ url, event }) => {
        return (url.pathname === '/assets/precached-image.jpg');
    },
    new CacheOnly({
        cacheName: "precached-image"
    })
);


registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheOnly({
        cacheName: 'image-cache',
    })
);

