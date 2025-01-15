<script lang="ts">
	import Icon from '@iconify/svelte';
	import ConfirmModal from '../modal/confirm.modal.svelte';
	import { onMount } from 'svelte';
	import { getPublicLogoImageSource } from '../themes/theme.selector';
	import Image from '$lib/components/image.svelte';

	export let logout;
	export let userId: string | undefined;
	export let deleteAccount: () => void;
	export let imageUrl: string | undefined;
	export let userName: string;

	let showConfirmDelete_ = false;
	let showConfirmLogout_ = false;
	$: showModal = showConfirmDelete_ || showConfirmLogout_;

	const deleteMessage_ =
		'Are you sure you want to delete your account? This action is irreversible, and all associated data will be permanently removed.';
	const logoutMessage_ = 'Are you sure you want to sign out?';
	$: deleteMessage = deleteMessage_;
	$: logoutMessage = logoutMessage_;
	let showUserMenu = false;
	let showThemeMenu = false;

	const themeModes = ['Light', 'Dark'];
	const themeOptions = [
		{ name: 'Blue', color: 'rgba(0, 150, 255, 0.1)', borderColor: 'rgba(0, 150, 255, 1)' },
		{ name: 'Mint', color: 'rgba(78, 197, 90, 0.1)', borderColor: 'rgba(78, 197, 90, 1)' },
		{ name: 'Grey', color: 'rgba(128, 128, 128, 0.1)', borderColor: 'rgba(128, 128, 128, 1)' },
		{ name: 'Teal', color: 'rgba(50, 153, 153, 0.1)', borderColor: 'rgba(50, 153, 153, 1)' },
		{ name: 'Gold', color: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 1)' }
	];

	let selectedMode = 'Light';
	let selectedOption = '';

	const userMenuItems = [
		{
			label: 'User Profile',
			icon: 'material-symbols:person-outline',
			href: `/users/${userId}/my-profile`
		},
		{ label: 'Themes', icon: 'mdi:palette-outline' },
		{ label: 'Sign Out', icon: 'material-symbols:logout', action: openLogoutModal },
		{ label: 'Delete My Account', icon: 'tabler:trash', action: openDeleteModal }
	];

	const logoImageSource = getPublicLogoImageSource();

	const handleModeChange = (theme: string) => {
		selectedMode = theme;
		localStorage.setItem('themeMode', theme);
		applyThemeOption();
	};

	const handleOptionChange = (option: string) => {
		selectedOption = option;
		localStorage.setItem('themeOption', option); 
		applyThemeOption();
	};

	const applyThemeOption = () => {
		const theme = selectedMode.toLowerCase();
		const option = selectedOption.toLowerCase();

		document.documentElement.setAttribute('data-theme', theme);
		document.documentElement.setAttribute('data-theme-option', option);

		const themeOption = themeOptions.find((opt) => opt.name.toLowerCase() === option);
		if (themeOption) {
			document.documentElement.style.setProperty('--theme-border-color', themeOption.borderColor);
		}
	};

	onMount(() => {
		const storedMode = localStorage.getItem('themeMode');
		const storedOption = localStorage.getItem('themeOption');

		if (storedMode) {
			selectedMode = storedMode;
			document.documentElement.setAttribute('data-theme', storedMode.toLowerCase());
		}

		if (storedOption) {
			selectedOption = storedOption;
			applyThemeOption();
		}
	});

	function openDeleteModal() {
		showConfirmDelete_ = true;
	}

	function openLogoutModal() {
		showConfirmLogout_ = true;
	}

	function handleDeleteConfirm() {
		if (deleteAccount) deleteAccount();
		showConfirmDelete_ = false;
	}

	function handleLogoutConfirm() {
		selectedMode = 'Light';
		selectedOption = '';
		localStorage.setItem('themeMode', 'Light');
		localStorage.removeItem('themeOption');
		applyThemeOption();

		if (logout) logout();
		showConfirmLogout_ = false;
	}

	function handleCancel() {
		showConfirmDelete_ = false;
		showConfirmLogout_ = false;
	}

	const closeThemeMenu = () => {
		showThemeMenu = false;
	};

	const userInitials = userName
		.split(' ')
		.map((word) => word[0])
		.join('');
</script>

<header class="navbar">
	<div class="flex items-center justify-between sm:px-4 h-14 w-full">
		<div class="flex items-center">
			<!-- <img src="/patient.png" alt="Logo" class="logo" /> -->
			<img src={logoImageSource} alt="Logo" class="px-4" width="100" height="100" />
		</div>

		<div class="relative ml-auto flex items-center">
			<button
				class=" user-profile-btn"
				aria-label="Toggle user menu"
				on:click={() => {
					showUserMenu = !showUserMenu;
					if (showUserMenu) showThemeMenu = false;
				}}
			>
				{#if imageUrl}
					<Image cls="initial-icon" source={imageUrl} w="24" h="24" />
				{:else}
					<span class="initial-icon">{userInitials}</span>
				{/if}
			</button>
			{#if showUserMenu}
				<div class="user-menu">
					<button class="user-menu-close" on:click={() => (showUserMenu = false)}>
						<Icon icon="ant-design:close-outlined" class="h-5 w-5" />
					</button>
					<div class="user-name">
						<!-- <div class="initial-icon">
							{userInitials}
						</div> -->
						{#if imageUrl}
							<Image cls="initial-icon" source={imageUrl} w="24" h="24" />
						{:else}
							<div class="initial-icon">{userInitials}</div>
						{/if}
						<span>{userName}</span>
					</div>
					<hr class="user-menu-divider" />

					{#each userMenuItems as item}
						{#if item.label === 'Themes'}
							<button class="user-menu-item" on:click={() => (showThemeMenu = !showThemeMenu)}>
								<Icon icon={item.icon} class="menu-icon" />
								<span>{item.label}</span>
							</button>
						{:else if item.label === 'Sign Out'}
							<button class="user-menu-item" on:click={item.action}>
								<Icon icon={item.icon} class="menu-icon" />
								<span>{item.label}</span>
							</button>
							<hr class="user-menu-divider" />
						{:else if item.label === 'Delete My Account'}
							<button class="delete-my-acc" on:click={item.action}>
								<Icon icon={item.icon} class="menu-icon" />
								<span>{item.label}</span>
							</button>
						{:else}
							<a href={item.href} class="user-menu-item">
								<Icon icon={item.icon} class="menu-icon" />
								<span>{item.label}</span>
							</a>
						{/if}
					{/each}
				</div>
			{/if}

			{#if showThemeMenu}
				<div class="theme-menu">
					<button class="themes-close-button" on:click={closeThemeMenu}>
						<Icon icon="ant-design:close-outlined" class="h-5 w-5" />
					</button>

					<div>
						<p class="para">Appearance</p>
						<div class="flex items-center space-x-4">
							{#each themeModes as theme}
								<div class="flex flex-col items-center">
									<button
										class={`relative  px-8 py-4 rounded-md border-2 ${
											theme === selectedMode
												? 'border-[var(--theme-border-color)]'
												: 'border-transparent'
										}`}
										style={`background-color: ${theme === 'Light' ? '#ffffff' : '#1a1a1a'}; color: ${
											theme === 'Light' ? '#000000' : '#ffffff'
										};`}
										on:click={() => handleModeChange(theme)}
									>
										<!-- Text inside the button -->
										<span class="flex items-center justify-center w-full h-full">
											{theme}
										</span>
									</button>
								</div>
							{/each}
						</div>
					</div>

					<hr class="theme-divider" />

					<div>
						<p class="para">Themes</p>

						<div class="grid grid-cols-3 gap-2 sm:gap-4">
							{#each themeOptions as { name, color, borderColor }}
								<button
									class="theme-option"
									class:selected={selectedOption === name}
									style="background-color: {color}; border: 1px solid {selectedOption === name
										? borderColor
										: 'grey'};"
									on:click={() => handleOptionChange(name)}
								>
									<div
										class="flex-shrink-0 rounded-full flex items-center justify-center border"
										style="background-color: {borderColor}; width: 1rem; height: 1rem; sm:width: 1.5rem; sm:height: 1.5rem;"
									>
										{#if selectedOption === name}
											<Icon icon="mdi:check" class="w-2 h-2 sm:w-3 sm:h-3 text-info" />
										{/if}
									</div>

									<div class="ml-1 sm:ml-2 text-info">{name}</div>
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<ConfirmModal
		show={showConfirmDelete_}
		title="Delete Account"
		message={deleteMessage}
		close={handleCancel}
		confirm={handleDeleteConfirm}
	/>

	<ConfirmModal
		show={showConfirmLogout_}
		title="Sign Out"
		message={logoutMessage}
		close={handleCancel}
		confirm={handleLogoutConfirm}
		confirmButtonText="Sign Out"
	/>
</header>
