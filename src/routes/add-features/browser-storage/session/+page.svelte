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
