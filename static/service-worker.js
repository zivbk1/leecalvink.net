const version = '1.00'; // change when updated
const coreCacheName = version + 'corecache';
addEventListener('install', installEvent => { // happens only once
  //skipWaiting(); // TODO: make 'update now' button for users for this
  installEvent.waitUntil(caches.open(coreCacheName).then(staticCache => { // staticCache…could be named anything
    staticCache.addAll([
      "/main.js",
      /*"/offline.html",*/
      "/main.css",
      "/icons.svg"
    ]);
    return staticCache.addAll([ // return make these "must" haves
      {%- assign font_files = site.static_files | where: 'font', true %}
      {%- for item in font_files %}
      {%- if forloop.last == true %}
      "{{ item.path }}"
      {%- else %}
      "{{ item.path }}",
      {%- endif %}
      {%- endfor %}
    ]);
  }));
});
addEventListener('activate', activateEvent => {
  activateEvent.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all( // delete old caches
      cacheNames.map(cacheName => {
        if (cacheName != coreCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  }).then( () => {
      return clients.claim(); // updated worker takes control right away
    })
  );
});
addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  if(request.headers.get('Accept').includes('text/css') || 
    request.headers.get('Accept').includes('text/javascript')) {
      fetchEvent.respondWith( // stale while revalidate (cache first, new on return visit)
        caches.open(coreCacheName).then(staticCache => {
        return staticCache.match(request).then(cacheFirst => {
          let networkSecond = fetch(request).then(networkResponse => {
            staticCache.put(request, networkResponse.clone());
            return networkResponse;
          })
          return cacheFirst || networkSecond;
        })
      })
    );
    return; // go no further, not sure if this is needed
  };
  fetchEvent.respondWith(caches.match(request).then(responseFromCache => {
    return responseFromCache || fetch(request); // (default) grab from cache, fallback to network
  }));
});
addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); // stop pwa installation prompt, TODO: enable with button press
});
