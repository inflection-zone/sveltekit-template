<script lang="ts">
	import BarChart from '../vitals.graphs/Bar.Chart.svelte';
	import LineChart from '../vitals.graphs/Line.Chart.svelte';
	import JoinLineChart from '../vitals.graphs/Join.Line.Chart.svelte';
	export let data;
	export let title;

	let date: any[] = [];
	let value: any[] = [];
	let value1: any[] = [];

	$: if (data && Array.isArray(data)) {
		data.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
		date = data.map((item) => item.date);
		value = data.map((item) => item.value);
		value1 = data.map((item) => item.value1);
	}
</script>

{#if data}
	<div>
		{#if title == 'Height'}
			<LineChart data={value} labels={date} {title} />
		{:else if title == 'Weight'}
			<!-- <BarChart dataSource={value} labels={date} {title} /> -->
			<LineChart data={value} labels={date} {title} />
		{:else if title == 'Blood Pressure'}
			<JoinLineChart data1={value} data2={value1} labels={date} {title} />
		{:else if title == 'Glucose'}
			<LineChart data={value} labels={date} {title} />
		{:else if title == 'Oxygen Saturation'}
			<LineChart data={value} labels={date} {title} />
		{:else if title == 'Temperature'}
			<LineChart data={value} labels={date} {title} />
		{:else if title == 'Pulse'}
			<LineChart data={value} labels={date} {title} />
		{/if}
	</div>
{/if}