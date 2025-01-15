<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

  /////////////////////////////////////////////////////////////////
  
	export let labels: string[] = [];
	export let data: number[] = [];
	export let title: string;

	let barChart: Chart;
	let canvas: HTMLCanvasElement;

	function getThemeColor(): { textColor: string; gridColor: string } {
		const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
		return {
			textColor: isDarkMode ? '#d9dee9' : '#1c252a', // Text color
			gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' // Grid color
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
						label: title,
						data: data,
						borderColor: '#808080',
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
						display: true,
						beginAtZero: false,
						grid: {
							display: true,
							color: gridColor,
							lineWidth: 0.5,
							borderDash: [5, 30]
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
				layout: {
					padding: {
						bottom: 0
					}
				},
				plugins: {
					legend: {
						display: false,
						labels: {
							color: textColor,
							boxWidth: 10,
							boxHeight: 10
						}
					},
					title: {
						display: false,
						text: title,
						color: textColor,
						font: {
							size: 22,
							weight: 'normal',
							lineHeight: 1.2
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
	{#if data && data.length > 0}
		<canvas bind:this={canvas} class="canvas"></canvas>
	{:else}
		<p class="not-available">No data available.</p>
	{/if}
</div>
