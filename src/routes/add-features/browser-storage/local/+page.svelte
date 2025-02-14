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
