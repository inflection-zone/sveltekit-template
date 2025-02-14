# Push Notification

## this is in `+page.svelte` file for registration and enable

```js
 async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
   try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
     type: 'module' // 👈 Fix: Declare as a module
    });
    console.log('Service Worker Registered', registration);
   } catch (error) {
    console.error('Service Worker Registration Failed:', error);
   }
  } else {
   alert('Service workers are not supported in your browser.');
  }
 }

 async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
   alert('Notifications enabled!');
  } else {
   alert('Notifications blocked.');
  }
 }

 async function triggerPush() {
  if (navigator.serviceWorker.controller) {
   navigator.serviceWorker.controller.postMessage('Hello from the page!');
   console.log('Message sent to the service worker.');
  }
 }
</script>

<button on:click={registerServiceWorker} class="bg-blue-500 text-white p-2 rounded">
 Register Service Worker
</button>

<button on:click={requestNotificationPermission} class="bg-green-500 text-white p-2 rounded ml-2">
 Enable Notifications
</button>

<button on:click={triggerPush} class="bg-purple-500 text-white p-2 rounded ml-2">
 Show Notification
</button>
```

## This is `service-worker.js` 