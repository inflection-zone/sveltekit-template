<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { addToast } from '$lib/components/toast/toast.store';
	import Toasts from '$lib/components/toast/toasts.svelte';
	import { initFlash } from 'sveltekit-flash-message/client';
	import {
		getPublicFooterLink,
		getPublicFooterText,
		getPublicLogoImageSource
	} from '$lib/components/themes/theme.selector';
//////////////////////////////////////////////////////////////////////////////////////////////////
	const logoImageSource = getPublicLogoImageSource();
	const footerText = `© ${new Date().getFullYear()} ${getPublicFooterText()}`;
	const footerLink = getPublicFooterLink();

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

	// Derived store to check if the current route starts with "/users"
	$: hideLogoAndFooter = $page.url.pathname.startsWith('/users');
</script>

<Toasts />
<slot />

{#if !hideLogoAndFooter}
	<div class="absolute top-4 left-4 flex items-center">
		<img src={logoImageSource} alt="Logo" class="px-4 w-32 h-auto" />
	</div>
	<footer class="fixed bottom-0 w-full text-center py-4">
		<a href={footerLink} class="!text-black">{footerText}</a>
	</footer>
{/if}
