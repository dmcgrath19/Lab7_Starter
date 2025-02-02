// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';
const urlsToCache = [
  // '/',
  // 'index.html',
  'favicon.ico',
  // 'assets/styles/main.css',
  // 'assets/scripts/main.js',
  // 'assets/scripts/Router.js',
  // 'assets/components/RecipeCard.js',
  // 'assets/components/RecipeExpand.js',
  // 'assets/images/icons/0-star.svg',
  'assets/images/icons/1-star.svg',
  'assets/images/icons/2-star.svg',
  'assets/images/icons/3-star.svg',
  'assets/images/icons/4-star.svg',
  'assets/images/icons/5-star.svg',
  // 'assets/images/icons/arrow-down.png'
  'https://introweb.tech/assets/json/ghostCookies.json',
  'https://introweb.tech/assets/json/birthdayCake.json',
  'https://introweb.tech/assets/json/chocolateChip.json',
  'https://introweb.tech/assets/json/stuffing.json',
  'https://introweb.tech/assets/json/turkey.json',
  'https://introweb.tech/assets/json/pumpkinPie.json'
];

// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  /**
   * TODO - Part 2 Step 2
   * Create a function as outlined above
   */

   event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        console.log(urlsToCache);
        return cache.addAll(urlsToCache);
      })
  );
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */
  event.waitUntil(clients.claim());
  console.log("Activated and clients claimed.");
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */

   event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log("Cache hit, returning response.");
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response, this breaks everything. Do not uncomment.
            // if(!response || response.status !== 200) {
              // return response;
            // }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            console.log("Cache miss, returning response.");  
            return response;
          }
        );
      })
    );
});