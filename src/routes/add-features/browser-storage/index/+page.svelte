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
