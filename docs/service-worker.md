# Service Worker

## Which Storage is Best for Offline Form Submissions?

**Recommendation**: Use IndexedDB

> **Reasons**:

**Handles Structured Data**: Unlike LocalStorage, IndexedDB can store objects directly, making it ideal for form submissions.

**Asynchronous**: Does not block the main thread, ensuring smooth performance.

**Large Capacity**: Suitable for apps that may need to store multiple or large forms offline.

**Persistence**: Data stays available even after browser restarts, making it reliable for offline apps.

How It Fits Your Scenario:

- You can store offline submissions as JSON objects in IndexedDB.
- Sync the stored data with the server when the network is restored.
- Delete synced data from IndexedDB to free up space.

Comparison Table

| **Feature**     | **LocalStorage** | **SessionStorage** | **Cookies**  | **IndexedDB**  | **Cache Storage** |
| --------------- | ---------------- | ------------------ | ------------ | -------------- | ----------------- |
| **Capacity**    | ~10 MB           | ~10 MB             | ~4 KB        | Hundreds of MB | Browser-limited   |
| **Persistence** | Until cleared    | Session only       | Configurable | Until cleared  | Until cleared     |
| **Data Type**   | Strings          | Strings            | Strings      | Objects/Blobs  | HTTP Responses    |
| **Performance** | Blocks UI        | Blocks UI          | N/A          | Async          | Async             |
| **Best For**    | Simple data      | Temp data          | HTTP data    | Complex data   | Static assets     |

Service worker in svelte [link in Documentation](https://svelte.dev/docs/kit/service-workers)

for the install activate and fetch use this code in your `src/service-worker.js` file

```js
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
import { build, files, version } from '$service-worker';

const CACHE_NAME = `cache-v1-${version}`;
const ASSETS = [...build, ...files];

sw.addEventListener('install', (event) => {
 // Create a new cache and add all files to it
 async function addFilesToCache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(ASSETS);
 }

 event.waitUntil(addFilesToCache());
});

// Remove old caches on activate
sw.addEventListener('activate', (event) => {
 // Remove previous cached data from disk
 async function deleteOldCaches() {
  for (const key of await caches.keys()) {
   if (key !== CACHE_NAME) await caches.delete(key);
  }
 }
 event.waitUntil(deleteOldCaches());
});
sw.addEventListener('fetch', (event) => {
 // ignore POST requests etc
 if (event.request.method !== 'GET') return;

 async function respond() {
  const url = new URL(event.request.url);
  const cache = await caches.open(CACHE_NAME);

  // `build`/`files` can always be served from the cache
  if (ASSETS.includes(url.pathname)) {
   const response = await cache.match(url.pathname);

   if (response) {
    return response;
   }
  }

  // for everything else, try the network first, but
  // fall back to the cache if we're offline
  try {
   const response = await fetch(event.request);

   // if we're offline, fetch can return a value that is not a Response
   // instead of throwing - and we can't pass this non-Response to respondWith
   if (!(response instanceof Response)) {
    throw new Error('invalid response from fetch');
   }

   if (response.status === 200) {
    cache.put(event.request, response.clone());
   }

   return response;
  } catch (err) {
   const response = await cache.match(event.request);

   if (response) {
    return response;
   }

   // if there's no cache, then just error out
   // as there is nothing we can do to respond to this request
   throw err;
  }
 }

 event.respondWith(respond());
});
```

These events install the service workers on build and activate for all routes of application.

Now for communicate with indexedDB make a file `$lib/utils/indexedDBUtils.ts` and add this code to this

This is generic code so you just have tocall and use this function where you want

```js
// IndexedDB Utility Functions

export async function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('offlineFormData', 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('submissions')) {
                db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function storeInIndexedDB(formName: string, data: Record<string, any>): Promise<void> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readwrite');
        const store = transaction.objectStore('submissions');
        const record = { formName, data, timestamp: Date.now() };

        const request = store.add(record);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}

export async function getAllFromIndexedDB(formName: string): Promise<Record<string, any>[]> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readonly');
        const store = transaction.objectStore('submissions');
        const request = store.getAll();

        request.onsuccess = () => {
            const results = request.result.filter((item) => item.formName === formName);
            resolve(results.map((item) => item.data));
        };
        request.onerror = () => reject(request.error);
    });
}

export async function clearIndexedDB(formName: string): Promise<void> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readwrite');
        const store = transaction.objectStore('submissions');

        // Delete records matching the formName
        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                if (cursor.value.formName === formName) {
                    cursor.delete();
                }
                cursor.continue();
            }
        };
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}
```

In your form component import these functions

```js
import { storeInIndexedDB, getAllFromIndexedDB, clearIndexedDB } from '$lib/utils/indexedDBUtils';
```

Add isOffline flag and form name

```js
 let isOffline = false;
 const formName = 'UserAccountForm';
```

Monitor network status and set events according to that

```js

 // Monitor network status
 onMount(() => {
  isOffline = !navigator.onLine;
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', () => (isOffline = true));
  checkAndSyncData();
 });

 async function handleOnline() {
  isOffline = false;
  await checkAndSyncData(); // Sync offline data when back online
 }
```

Submit function and sync data to API server

```js
async function submitForm(event: Event) {
  event.preventDefault();
  const formElement = event.target as HTMLFormElement;
  const formData = new FormData(formElement);
  const data = Object.fromEntries(formData.entries());

  if (isOffline) {
   console.log('Offline. Storing data in IndexedDB.');
   await storeInIndexedDB(formName, data);
  } else {
   console.log('Online. Submitting data via form action.');
   formElement.submit(); // Submit form to the action directly
  }
 }

 async function checkAndSyncData() {
  const offlineData = await getAllFromIndexedDB(formName);
  if (offlineData.length > 0) {
   for (const data of offlineData) {
    // Send the data to the server using fetch
    try {
     await fetch('/api/server/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
     });
    } catch (error) {
     console.error('Failed to sync data:', error);
    }
   }
   await clearIndexedDB(formName); // Clear synced data from IndexedDB
  }
 }
```

Use form as

```html
  <form
   class="w-full space-y-4"
   method="post"
   use:enhance
   action="?/create"
   onsubmit={submitForm}
  >
```

And form field is as

```html
<div>
    <label for="FirstName" class="block text-sm font-medium text-gray-700">First Name</label>
    <input
     name="FirstName"
     type="text"
     placeholder="Enter first name"
     class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
     bind:value={$form.FirstName}
     aria-invalid={$errors.FirstName ? 'true' : undefined}
     {...$constraints.FirstName}
    />

    {#if $errors.FirstName}
     <p class="mt-1 text-sm text-red-500">{$errors.FirstName}</p>
    {/if}
   </div>
```

## For offline support fallback page

For offline support we need to configure offline page URL in `service-worker.js` like

```js
const OFFLINE_URL = '/offline';
```

And update the events like

```js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([OFFLINE_URL]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(OFFLINE_URL);
        })
    );
});

```

And `offline/+page.svelte` will be

```html
<script>
    // Optional logic can go here if needed
</script>

<div class="flex h-screen items-center justify-center bg-gray-100 text-center">
    <div>
        <h1 class="text-4xl font-bold text-gray-800">You are offline</h1>
        <p class="mt-4 text-gray-600">Please check your internet connection.</p>
        <button
            class="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onclick={() => window.location.reload()}
        >
            Retry
        </button>
    </div>
</div>
```
