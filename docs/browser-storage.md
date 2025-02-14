# What is a Service Worker?

A service worker is a script that your browser runs in the background, separate from a web page. It acts as a network proxy, allowing you to intercept and handle network requests, including programmatically managing a cache of responses.

## How Does It Work?

Registration: First, the service worker script is registered with the browser.

**Installation** : Once registered, the service worker is installed and activated.

**Interception** : The service worker can intercept network requests made by the web page. It can choose to respond with cached content or fetch new content from the network2.

**Caching** : Service workers can cache responses, which allows for offline functionality and faster load times.

**Background Sync** : They can also handle background tasks, such as sending push notifications or synchronizing data in the background.

## Benefits

**Offline Capabilities** : Service workers enable web applications to work offline or on low-quality networks.

**Performance** : They can improve performance by caching assets and serving them locally.

**User Experience** : Enhances user experience with features like push notifications and background sync.

### Example Use Case

Imagine a news app that uses a service worker. When a user visits the app, the service worker can check if there's cached content available2. If there is, it serves the cached content immediately, reducing load times. If not, it fetches the latest content from the server and updates the cache for future use.

## 1. LocalStorage

**Description**
: Key-value storage available on the browser.

**Capacity**: Typically 5–10 MB.

**Scope**: Per origin (shared across tabs and windows for the same domain).
**Persistence**: Data is stored until explicitly removed by the user or application.

**Synchronous**: Access blocks the main thread.

**Best For**:

- Small, non-sensitive data like UI preferences or theme settings.
- Quick lookups that don't need high security or advanced querying.

**Drawbacks**:

- Cannot store large amounts of data.
- Blocking nature can slow down the UI.
- Not suitable for complex objects (only strings can be stored).

## 2. SessionStorage

**Description**: Similar to LocalStorage, but data persists only for the duration of the page session.

**Capacity**: Typically 5–10 MB.

**Scope**: Per tab or window; data isn't shared between them.

**Persistence**: Cleared when the tab or browser is closed.

**Best For**:
-Storing temporary data like form inputs during navigation.

**Drawbacks**:

- Limited persistence.
- Same limitations as LocalStorage (synchronous, string-only).

## 3. Cookies

**Description**: Small pieces of data sent with every HTTP request to the server.

**Capacity**: ~4 KB per cookie.

**Scope**: Sent automatically to the server with matching requests.

**Persistence**: Controlled by the expires or max-age attributes.

**Best For**:

- Storing server-side session IDs or other authentication tokens.
- Ensuring the server receives small pieces of data automatically.

**Drawbacks**:

- Limited storage capacity.
- Included in every HTTP request, which can slow down performance.

## 4. IndexedDB

**Description**: A low-level, asynchronous, NoSQL database available in the browser.

**Capacity**: Hundreds of MB (depending on browser and device).

**Scope**: Per origin.

**Persistence**: Data persists until explicitly cleared by the user or app.

**Best For**:

- Storing large or complex datasets (e.g., offline forms, app data).
- Querying data using indexes.

**Drawbacks**:

- API is more complex than other storage options.
- Requires more setup for simpler use cases.

## 5. Cache Storage (Service Worker Cache)

**Description**: Stores HTTP responses and resources for offline use.

**Capacity**: Limited by browser storage policies (shared with other storage).

**Scope**: Controlled by the Service Worker.

**Persistence**: Data persists until removed or updated by the Service Worker.

**Best For**:

- Storing static resources (HTML, CSS, JS, images).
- Offline-first web apps.

**Drawbacks**:

- Not suitable for structured data or direct querying.

## 6. WebSQL (Deprecated)

**Description**: Relational database storage for browsers.

**Status**: Deprecated and no longer recommended for new projects.

## 7. File System Access API

**Description**: Allows web apps to read/write files to the user’s local file system (with permissions).

**Scope**: Direct file system access.

**Best For**:

- Managing large files directly, like images or documents.

**Drawbacks**:

- Requires user permissions.
- Limited to modern browsers.

## 8. Web Storage (Memory Storage)

**Description**: Temporary, in-memory storage available during the browser session.

**Scope**: Per tab or window.

**Best For**:

- Volatile data that doesn’t need to persist (e.g., temporary computations).

**Drawbacks**:

- Lost when the page is refreshed or the tab is closed.

### Comparison Table

| **Feature**     | **LocalStorage** | **SessionStorage** | **Cookies**  | **IndexedDB**  | **Cache Storage** |
| --------------- | ---------------- | ------------------ | ------------ | -------------- | ----------------- |
| **Capacity**    | ~10 MB           | ~10 MB             | ~4 KB        | Hundreds of MB | Browser-limited   |
| **Persistence** | Until cleared    | Session only       | Configurable | Until cleared  | Until cleared     |
| **Data Type**   | Strings          | Strings            | Strings      | Objects/Blobs  | HTTP Responses    |
| **Performance** | Blocks UI        | Blocks UI          | N/A          | Async          | Async             |
| **Best For**    | Simple data      | Temp data          | HTTP data    | Complex data   | Static assets     |

For using the IndexDB as browser sstorage as offline storage

this is `+page.svelte` add this form submission and add the form submit event to form

```js
 const dbName = 'myFormDatabase';
 const storeName = 'forms';
 const formName = 'UserAccountForm';

let storage = new StorageManager('indexedDB', dbName, storeName);

async function submitForm(event: Event) {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const data: Record<string, PrimitiveType | File> = {};
    formData.forEach((value, key) => {
        data[key] = value as PrimitiveType | File;
    });

    // Convert CountryCode to an integer
    if (data.CountryCode) {
        data.CountryCode = parseInt(data.CountryCode as string, 10);
    }

    // Validate form data
    const result = schema.safeParse({
        FirstName: data.FirstName,
        LastName: data.LastName,
        CountryCode: data.CountryCode,
        Phone: data.Phone,
        Email: data.Email,
        Username: data.Username,
        Password: data.Password,
    });

    if (!result.success) {
        // Handle validation errors
        console.error('Validation errors:', result.error.errors);
        result.error.errors.forEach(error => {
            console.error(`Error in ${error.path[0]}: ${error.message}`);
        });
        return;
    }

    // Format the current date to "07 February 2025"
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    console.log('Form Data:', data);
    if (isOffline) {
        console.log('Offline. Storing data in IndexedDB.');
        const storeObject = {
            id: formName,
            name: formName,
            data: data,
            createdAt: formattedDate,
            updatedAt: formattedDate,
            metadata: {}
        };
        await storage.set(formName, storeObject);
    } else {
        console.log('Online. Submitting data via form action.');
        // formElement.submit();
    }
}

async function checkAndSyncData() {
    const offlineData = await storage.get(formName);
    console.log('Offline Data:', offlineData);
    if (offlineData) {
        try {
            await fetch('/api/server/submit', {
                method: 'POST',
                body: JSON.stringify(offlineData.data),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Failed to sync data:', error);
        }
        await storage.remove(formName);
    }
}
```

Add this to form

```html
  <form
   class="w-full space-y-4"
   method="post"
   use:enhance
   action="?/create"
   onsubmit={submitForm}
  >
 ```

## Following are the examplea of other browser storages

### This is example of IndexedBD

```js
<script lang="ts">
 import { onMount } from 'svelte';
 import {StorageManager} from '$lib/utils/storage';

 let storage = new StorageManager('indexedDB', 'MyDB', 'MyStore');

 let objectValue = { name: '', age: 0 };

 async function saveData() {
  await storage.set('objectKey', objectValue);
  console.log('Data saved!');
 }

 async function loadData() {
  objectValue = (await storage.get('objectKey')) || { name: '', age: 0 };
  console.log('Data loaded:', { objectValue });
 }

 // Load data on mount
 onMount(loadData);
</script>

<main class="p-6 space-y-4">
 <h1 class="text-xl font-bold">IndexedDB Storage</h1>

 <label class="block">
  Object (Name & Age):
  <input type="text" bind:value={objectValue.name} placeholder="Name" class="border p-2 w-full" />
  <input
   type="number"
   bind:value={objectValue.age}
   placeholder="Age"
   class="border p-2 w-full mt-2"
  />
 </label>

 <button on:click={saveData} class="bg-blue-500 text-white px-4 py-2 rounded"> Save Data </button>
</main>
```

### this is example of local storage

```js
<script lang="ts">
 import { StorageManager } from '$lib/index';
 let localStorage = new StorageManager('local');

 let value = '';

 function save() {
  localStorage.set('key', value);
 }

 async function load() {
  value = (await localStorage.get<string>('key')) || '';
 }

 function clear() {
  localStorage.remove('key');
 }
</script>

<input type="text" bind:value />
<button on:click={save}>Save</button>
<button on:click={load}>Load</button>
<button on:click={clear}>Clear</button>
```

### This is session Storage example

```js
<script lang="ts">
 import { StorageManager } from '$lib/index';
 let sessionStorage = new StorageManager('session');

 let value = '';

 function save() {
  sessionStorage.set('key', value);
 }

 async function load() {
  value = (await sessionStorage.get<string>('key')) || '';
 }

 function clear() {
  sessionStorage.remove('key');
 }
</script>

<input type="text" bind:value />
<button on:click={save}>Save</button>
<button on:click={load}>Load</button>
<button on:click={clear}>Clear</button>
```
