<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { addToast } from '$lib/components/toast/toast.store';
	import Toasts from '$lib/components/toast/toasts.svelte';
	import { initFlash } from 'sveltekit-flash-message/client';

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	const flash = initFlash(page);

	flash.subscribe(($flash) => {
		if (!$flash) return;
		addToast({
			type: $flash.type || 'info',
			message: $flash.message,
			dismissible: true,
			timeout: 3000
		});
		flash.set(undefined);
	});
</script>

<Toasts />
<slot />