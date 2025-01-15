<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import { createTimeSeriesConfig, type ProcessedChartData } from '$lib/utils.ts/chart.config';

	///////////////////////////////////////////////////////////////////////////

	export let chartData: ProcessedChartData;

	let timeSeriesCanvas: HTMLCanvasElement;
	let timeSeriesChart: Chart | null = null;

	const initChart = () => {
		if (timeSeriesCanvas && chartData?.datasets?.length > 0) {
			const tsCtx = timeSeriesCanvas.getContext('2d');
			if (tsCtx) {
				if (timeSeriesChart) {
					timeSeriesChart.destroy();
				}
				const config = createTimeSeriesConfig(chartData);
				timeSeriesChart = new Chart(tsCtx, config);
			}
		}
	};

	onMount(() => {
		initChart();
		return () => {
			if (timeSeriesChart) timeSeriesChart.destroy();
		};
	});
</script>

<div class="chart">
	<canvas class="canvas" bind:this={timeSeriesCanvas}></canvas>
</div>
