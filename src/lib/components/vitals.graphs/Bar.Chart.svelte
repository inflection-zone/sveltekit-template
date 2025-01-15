<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
  
	///////////////////////////////////////////////////////////////
	
	export let labels: string[] = [];
	export let dataSource: number[] = [];
	export let title: string;
  
	let barChart: any;
	let canvas: HTMLCanvasElement;
  
	function getThemeColor(): { textColor: string; gridColor: string } {
	  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
	  return {
		textColor: isDarkMode ? '#d9dee9' : '#1c252a', // Text color
		gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Grid color
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
		type: 'bar',
		data: {
		  labels: labels,
		  datasets: [
			{
			  label: title,
			  data: dataSource,
			  backgroundColor: '#A8E3F7',
			  borderColor: '#D72929',
			  borderWidth: 1,
			  borderRadius: {
				topLeft: 4,
				topRight: 4,
			  },
			},
		  ],
		},
		options: {
		  responsive: true,
		  maintainAspectRatio: false,
		  indexAxis: 'x',
		  scales: {
			x: {
			  grid: {
				display: false,
			  },
			  ticks: {
				autoSkip: true,
				autoSkipPadding: 10,
				maxRotation: 30,
				minRotation: 0,
				color: textColor,
			  },
			  title: {
				display: true,
				text: 'Dates',
				color: textColor,
			  },
			},
			y: {
			  beginAtZero: true,
			  grid: {
				display: true,
				color: gridColor,
				lineWidth: 0.3,
				tickBorderDash: [10, 10], // Dashed lines
			  },
			  ticks: {
				color: textColor,
			  },
			  title: {
				display: true,
				text: title,
				color: textColor,
			  },
			},
		  },
		  layout: {
			padding: {
			  bottom: 0,
			},
		  },
		  plugins: {
			legend: {
			  display: false,
			  labels: {
				color: textColor,
				boxWidth: 10,
				boxHeight: 10,
			  },
			},
			title: {
			  display: false,
			  text: title,
			  position: 'top',
			  align: 'start',
			  padding: 5,
			  font: {
				size: 22,
				weight: 'normal',
				lineHeight: 1.2,
			  },
			},
			tooltip: {
			  callbacks: {},
			},
		  },
		},
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
		attributeFilter: ['data-theme'],
	  });
  
	  return () => {
		if (barChart) barChart.destroy();
		observer.disconnect();
	  };
	});
  
	onDestroy(() => {
	  if (barChart) {
		barChart.destroy();
	  }
	});
  </script>
  
  <div class="chart">
	{#if dataSource && dataSource.length > 0}
	  <canvas bind:this={canvas} class="canvas"></canvas>
	{:else}
	  <p class="not-available">No data available.</p>
	{/if}
  </div>
  