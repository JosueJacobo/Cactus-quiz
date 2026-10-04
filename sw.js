/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-b1bafff1'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "402b66900e731ca748771b6fc5e7a068"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "d757cdbcbaf15acebc0e4624c391fb67"
  }, {
    "url": "pwa-512x512.png",
    "revision": "489983a75990877cf2b955e283284735"
  }, {
    "url": "pwa-192x192.png",
    "revision": "25d8dae004d20a062b1fbda3ef345d06"
  }, {
    "url": "index.html",
    "revision": "4bfc7786f15692a88530765f12528c37"
  }, {
    "url": "icon.svg",
    "revision": "36c3a0421cf0695e77bf74ab8f3dc97f"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "7820466bd87a5791e44b710c528ef042"
  }, {
    "url": "assets/index-CMsp904v.css",
    "revision": null
  }, {
    "url": "assets/index-CKX8_FWF.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "7820466bd87a5791e44b710c528ef042"
  }, {
    "url": "icon.svg",
    "revision": "36c3a0421cf0695e77bf74ab8f3dc97f"
  }, {
    "url": "pwa-192x192.png",
    "revision": "25d8dae004d20a062b1fbda3ef345d06"
  }, {
    "url": "pwa-512x512.png",
    "revision": "489983a75990877cf2b955e283284735"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "d757cdbcbaf15acebc0e4624c391fb67"
  }, {
    "url": "manifest.webmanifest",
    "revision": "4d744282cd3861d9898b29e459d3d3a4"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/upload\.wikimedia\.org\/.*/i, new workbox.CacheFirst({
    "cacheName": "wikimedia-cactus-images-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 1600,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/(en|es|commons)\.(wikipedia|wikimedia)\.org\/w\/api\.php.*/i, new workbox.StaleWhileRevalidate({
    "cacheName": "wikimedia-api-metadata-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 500,
      maxAgeSeconds: 15552000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
