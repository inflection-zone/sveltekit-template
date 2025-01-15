<script>
	import Navbar from '$lib/components/home/Navbar.svelte';
	import Sidebar from '$lib/components/home/Sidebar.svelte';
	import { page } from '$app/stores';
	import { getPublicFooterLink, getPublicFooterText } from '$lib/components/themes/theme.selector';

	//////////////////////////////////////////////////////////////////////

	export let data;
	const userId = $page.params.userId;
	// const username = data.sessionUser.fullName;
	// const imageUrl = data.sessionUser.profileImageUrl;
	// const logoImageSource = getPublicLogoImageSource();

	console.log('data', data.user);	
	$:username = data.user.Person.DisplayName;
	$:email = data.user.Person.Email;
	$:imageUrl = data.user.Person.ProfileImageURL;
	const footerText = `© ${new Date().getFullYear()} ${getPublicFooterText()}`;
	const footerLink = getPublicFooterLink();

	const onLogout = async () => {
		const response = await fetch(`/api/server/logout`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' }
		});
		const resp = await response.text();
		console.log(`resp: ${JSON.stringify(resp, null, 2)}`);
		window.location.href = '/';
	};

	const onDelete = async () => {
		console.log('onDelete');
		const response = await fetch(`/api/server/user/delete`, {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' }
		});
		const resp = await response.text();
		console.log(`resp: ${JSON.stringify(resp, null, 2)}`);
		window.location.href = '/';
	};
	
</script>

<div class="flex flex-col min-h-screen">
	<Navbar {userId} logout={onLogout} userName={username} {imageUrl} deleteAccount={onDelete} />

	<div class="flex min-h-screen">
		<Sidebar {userId} />
		<div class="main-content">
			<slot />
		</div>
	</div>
	<!-- <footer class="fixed bottom-0 w-full text-center py-4">
		<a href={footerLink} class="!text-black !dark:text-white">{footerText}</a>
	</footer> -->
</div>

