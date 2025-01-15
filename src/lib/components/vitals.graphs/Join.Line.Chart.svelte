<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import annotationPlugin from 'chartjs-plugin-annotation';

	///////////////////////////////////////////////////////////////

	Chart.register(annotationPlugin);

	export let labels: string[] = [];
	export let data1: number[] = [];
	export let data2: number[] = [];
	export let title: string;
	export let systolicReference: number = 120;
	export let diastolicReference: number = 80;

	let barChart: Chart;
	let canvas: HTMLCanvasElement;

	function getThemeColor(): { textColor: string; gridColor: string } {
		const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
		return {
			textColor: isDarkMode ? '#d9dee9' : '#1c252a',
			gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
		};
	}

	function createChart() {
		const { textColor, gridColor } = getThemeColor();

		if (barChart) {
			barChart.destroy();
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		barChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Systolic',
						data: data1,
						borderColor: '#808080',
						backgroundColor: 'transparent',
						borderWidth: 2,
						pointRadius: 2,
						pointHoverRadius: 4,
						tension: 0.3
					},
					{
						label: 'Diastolic',
						data: data2,
						borderColor: '#A5DFF3',
						backgroundColor: 'transparent',
						borderWidth: 2,
						pointRadius: 2,
						pointHoverRadius: 4,
						tension: 0.3
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							color: textColor
						},
						title: {
							display: true,
							text: 'Date',
							color: textColor
						}
					},
					y: {
						grid: {
							display: true,
							color: gridColor,
							lineWidth: 0.3,
							borderDash: [10, 10] // Dashed lines
						},
						ticks: {
							color: textColor
						},
						title: {
							display: true,
							text: title,
							color: textColor
						}
					}
				},
				plugins: {
					legend: {
						display: true,
						labels: {
							boxWidth: 15,
							boxHeight: 10,
							usePointStyle: true,
							pointStyle: 'circle',
							color: textColor
						}
					},
					annotation: {
						annotations: {
							systolicLine: {
								type: 'line',
								yMin: systolicReference,
								yMax: systolicReference,
								borderColor: textColor,
								borderWidth: 0.5,
								borderDash: [5, 5],
								label: {
									content: 'Systolic Reference',
									enabled: true,
									position: 'end',
									color: '#FF0000'
								}
							},
							diastolicLine: {
								type: 'line',
								yMin: diastolicReference,
								yMax: diastolicReference,
								borderColor: textColor,
								borderWidth: 0.5,
								borderDash: [5, 5],
								label: {
									content: 'Diastolic Reference',
									enabled: true,
									position: 'end',
									color: '#0000FF'
								}
							}
						}
					}
				}
			}
		});
	}

	function updateChartOnThemeChange() {
		createChart();
	}

	onMount(() => {
		createChart();
		const observer = new MutationObserver(updateChartOnThemeChange);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});

		return () => {
			if (barChart) barChart.destroy();
			observer.disconnect();
		};
	});

	onDestroy(() => {
		if (barChart) barChart.destroy();
	});
</script>

<div class="chart">
	{#if data1 && data1.length > 0 && data2 && data2.length > 0}
		<canvas bind:this={canvas} class="canvas"></canvas>
	{:else}
		<p class="not-available">Data not available.</p>
	{/if}
</div>
