<script lang="ts">
	import CareplanStackedChart from '$lib/components/careplan/careplan.stacked.chart.svelte';
	import Icon from '@iconify/svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let careplanTasks = data.careplanTasks || [];
	let selectedView: 'day' | 'week' = 'day';
	let careplanData = careplanTasks[0];
	let careplanCode = careplanData?.Action?.PlanCode ?? '';
	let careplanName = careplanData?.Action?.PlanName ?? '';

	const hasData = careplanTasks.length > 0;

	function getTaskCounts(tasks: any[]) {
		const taskCounts = {
			total: 0,
			completed: 0,
			delayed: 0
		};

		if (!tasks?.length) return taskCounts;

		tasks.forEach((task) => {
			taskCounts.total++;
			switch (task.Status) {
				case 'Completed':
					taskCounts.completed++;
					break;
				case 'Delayed':
					taskCounts.delayed++;
					break;
			}
		});
		return taskCounts;
	}
	const taskStatusCounts = getTaskCounts(careplanTasks);
</script>

<div class=" careplan-container">
	<div class="flex justify-between items-center mb-4">
		<h2 class="careplan-history">Careplan History</h2>
		{#if hasData}
			<div class="flex items-center gap-2">
				<span class="title">View:</span>

				<div class="relative">
					<select class=" select" bind:value={selectedView}>
						<option value="day">Day Wise</option>
						<option value="week">Week Wise</option>
					</select>
					<div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
						<Icon icon="mdi:chevron-down" class="text-info w-5 h-5 " />
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if hasData}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			<div class="status-card">
				<div class="title">Total Tasks</div>
				<div class=" counts">{taskStatusCounts.total || 0}</div>
			</div>
			<div class="status-card">
				<div class="title">Completed</div>
				<div class=" counts">{taskStatusCounts.completed || 0}</div>
			</div>
			<div class="status-card">
				<div class="title">Pending</div>
				<div class=" counts">{taskStatusCounts.delayed || 0}</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6">
			<!-- table -->
			<div class="careplan-info-table">
				<table class="careplan-table">
					<tbody class="careplan-table-body">
						<tr class="careplan-table-row">
							<td class="py-1" style="width: 20%;">Careplan</td>
							<td class="py-1" style="width: 20%;">{careplanName || '-'}</td>
						</tr>

						<tr class="careplan-table-row">
							<td class="py-1" style="width: 20%;">Code</td>
							<td class="py-1" style="width: 20%;">{careplanCode || '-'}</td>
						</tr>
						<tr class="careplan-table-row">
							<td class="py-1" style="width: 20%;">Start Date</td>
							<td class="py-1" style="width: 20%;">{data.startDate || '-'}</td>
						</tr>
						<tr>
							<td class="py-1" style="width: 20%;">End Date</td>
							<td class="py-1" style="width: 20%;">{data.endDate || '-'}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- chart -->
			<div class=" chart">
				<div class="canvas">
					<CareplanStackedChart tasks={careplanTasks} view={selectedView} />
				</div>
			</div>
		</div>
	{:else}
		<p class="not-available">Careplan data not available</p>
	{/if}
</div>
