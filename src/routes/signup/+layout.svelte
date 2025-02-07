<script lang="ts">
	import {
		getPublicFooterLink,
		getPublicFooterText,
		getPublicLogoImageSource
	} from '$lib/components/themes/theme.selector';
	//////////////////////////////////////////////////////////////////////////////////////////////
	const logoImageSource = getPublicLogoImageSource();
	const footerText = `© ${new Date().getFullYear()} ${getPublicFooterText()}`;
	const footerLink = getPublicFooterLink();
</script>

<slot />
<div class="absolute top-4 left-4 flex items-center">
	<img src={logoImageSource} alt="Logo" class="px-4 w-32 h-auto" />
</div>
<footer class="fixed bottom-0 w-full text-center py-4">
	<a href={footerLink} class="!text-black">{footerText}</a>
</footer>
