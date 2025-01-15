<script lang="ts">
	import UserHistoryTable from '$lib/components/home/user.history.table.svelte';
	import { page } from '$app/stores';
	import Timeline from '$lib/components/chart/timeline.chart.svelte';
	import type { PageServerData } from './$types';

	///////////////////////////////////////////////////////////////////////////
    
	export let data: PageServerData;
	const { chartData, tableData } = data;
	console.log("chartData", chartData);
	const userId = $page.params.userId;

</script>

<div class="mx-2 sm:mx-8">
	<div class=" mb-5">
		<div>
			{#if tableData?.length > 0}
				<Timeline {chartData} />
			{:else}
			<p class="not-available">No Data Available.</p>
			{/if}
		</div>
	</div>
	<UserHistoryTable data={tableData} />
</div>