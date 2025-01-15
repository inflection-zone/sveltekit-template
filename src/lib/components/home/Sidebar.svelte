<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { sidebarMenu, type TabDefinition } from './navigation.tabs';

	export let userId: string | undefined = undefined;

	const sidebarTabs: TabDefinition[] = sidebarMenu(userId);

	userId = $page.params.userId;
	// let homeLink = `/users/${userId}/careplan`;
</script>

<div class="flex">
	<div class="sidebar">
		<ul class="sidebar-list">
			{#each sidebarTabs as tab}
				<li>
					<a href={tab.path} class="sidebar-item" class:!bg-active={$page.url.pathname.startsWith(tab.path)}>
						<Icon icon={tab.icon} class="iconsize" />
						<span class="sidebar-text">{tab.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
