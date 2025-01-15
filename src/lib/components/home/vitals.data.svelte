<script lang="ts">
	import Icon from '@iconify/svelte';
	import { formatDateMonth } from '../../utils.ts/functions';

	export let data: any[] = [];
	export let title: string;

	let currentPage = 1;
	let pageSize = 5;
	let sortOrder = 'ascending';
	let sortedData = [...data];
	$: sortedData = [...data].sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		if (sortOrder === 'ascending') {
			return dateA.getTime() - dateB.getTime();
		} else {
			return dateB.getTime() - dateA.getTime();
		}
	});

	$: paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function nextPage() {
		const totalPages = Math.ceil(sortedData.length / pageSize);
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	$: totalPages = Math.ceil(sortedData.length / pageSize);

	function sortByDate() {
		sortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
	}

	function updatePageSize(event: Event) {
		const value = parseInt((event.target as HTMLSelectElement).value, 10);
		pageSize = value;
		currentPage = 1; // Reset to first page
	}
</script>

{#if data.length > 0}
	<div class="table-container ">
		<div class="table-wrapper">
			<table class="w-full border-collapse text-sm">
				<thead class="thead ">
					<tr >
						<th class="th w-[5%] "></th>
						<th class="th w-[40%] lg:w-[15%]" on:click={sortByDate}>
							<div class="flex items-center">
								<span>Date</span>
								<span class="sort-icon">
									{#if sortOrder === 'ascending'}
										<Icon icon="mdi:arrow-up" />
									{:else}
										<Icon icon="mdi:arrow-down" />
									{/if}
								</span>
							</div>
						</th>
						{#if title == 'Blood Pressure'}
							<th class="th w-[30%] lg:w-[15%]">Systolic ({data[0].unit})</th>
							<th class="th">Diastolic ({data[0].unit})</th>
						{:else}
							<th class="th">{title} ({data[0].unit})</th>
						{/if}
					</tr>
				</thead>
				<tbody class="tbody">
					{#each paginatedData as item, index}
						<tr class="tabledata">
							<td class="td w-[5%]">{(currentPage - 1) * pageSize + index + 1}</td>
							<td class="td w-[40%] lg:w-[15%]">{formatDateMonth(item.date)}</td>
							{#if title == 'Blood Pressure'}
								<td class="td w-[30%] lg:w-[15%]">{item.value}</td>
								<td class="td">{item.value1}</td>
							{:else}
								<td class="td">{item.value}</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Page Selector and Pagination Controls -->
		<div class="table-footer">
			<div class="relative">
				<select class="page-size-selector" on:change={updatePageSize}>
					<option class="pages" value="5">5 Records per page</option>
					<option class="pages" value="10">10 Records per page</option>
					<option class="pages" value="15">15 Records per page</option>
				</select>
				<div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
					<Icon icon="mdi:chevron-down" class="text-info w-5 h-5 " />
				</div>
			</div>

			<div class="pagination-controls">
				<button
					class="pagination-button"
					on:click={() => (currentPage = 1)}
					disabled={currentPage === 1}
				>
					First
				</button>
				<button class="pagination-button" on:click={prevPage} disabled={currentPage === 1}>
					<Icon icon="mdi:less-than" width="20" height="20" />
				</button>
				<span class="current-page">{currentPage}</span>
				<button class="pagination-button" on:click={nextPage} disabled={currentPage === totalPages}>
					<Icon icon="mdi:greater-than" width="20" height="20" />
				</button>
				<button
					class="pagination-button"
					on:click={() => (currentPage = totalPages)}
					disabled={currentPage === totalPages}
				>
					Last
				</button>
			</div>
		</div>
	</div>
{:else}
	<p class="  not-available">No data available for {title}.</p>
{/if}
