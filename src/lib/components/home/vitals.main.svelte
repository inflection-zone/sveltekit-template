<script lang="ts">
	import VitalsGraph from './vitals.graph.svelte';
	import VitalsData from './vitals.data.svelte';

	export let title: string;
	export let data: any[] = [];
</script>

<div class="mx-2 sm:mx-8">
	<div class="my-4">
		<div>
			{#if data.length > 0}
				<VitalsGraph {data} {title} />
			{/if}
		</div>
	</div>
	<VitalsData {data} {title} />
</div>
