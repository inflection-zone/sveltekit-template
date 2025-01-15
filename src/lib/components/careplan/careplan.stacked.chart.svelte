<script lang="ts">
	import { Chart, Colors, registerables } from 'chart.js';
	import { onMount } from 'svelte';

	Chart.register(...registerables);

	export let tasks: any[] = [];
	export let view: 'day' | 'week' = 'day';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	// Function to process tasks data based on the selected view ('day' or 'week')
	function processTasksData(tasks: any[], viewType: 'day' | 'week') {
		if (!tasks?.length) return { labels: [], datasets: [] };

		const sortedTasks = [...tasks].sort(
			(a, b) => new Date(a.ScheduledStartTime).getTime() - new Date(b.ScheduledStartTime).getTime()
		);

		const firstDate = new Date(sortedTasks[0].ScheduledStartTime);
		const lastDate = new Date(sortedTasks[sortedTasks.length - 1].ScheduledStartTime);

		const dataMap = new Map();

		if (viewType === 'day') {
			const totalDays =
				Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
			for (let i = 0; i < totalDays; i++) {
				dataMap.set(`Day ${i + 1}`, { Completed: 0, Delayed: 0 });
			}
		} else {
			const totalWeeks =
				Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
			for (let i = 0; i < totalWeeks; i++) {
				dataMap.set(`Week ${i + 1}`, { Completed: 0, Delayed: 0 });
			}
		}

		sortedTasks.forEach((task) => {
			const taskDate = new Date(task.ScheduledStartTime);
			let key;

			if (viewType === 'day') {
				const dayDiff = Math.floor(
					(taskDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
				);
				key = `Day ${dayDiff + 1}`;
			} else {
				const weekDiff = Math.floor(
					(taskDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
				);
				key = `Week ${weekDiff + 1}`;
			}

			const entry = dataMap.get(key);
			if (entry) {
				if (task.Status === 'Completed') entry.Completed++;
				else if (task.Status === 'Delayed') entry.Delayed++;
			}
		});

		const sortedLabels = Array.from(dataMap.keys()).sort((a, b) => {
			const aNum = parseInt(a.split(' ')[1]);
			const bNum = parseInt(b.split(' ')[1]);
			return aNum - bNum;
		});

		return {
			labels: sortedLabels,
			datasets: [
				{
					label: 'Completed',
					data: sortedLabels.map((label) => dataMap.get(label).Completed),
					backgroundColor: '#22C55E'
				},
				{
					label: 'Pending',
					data: sortedLabels.map((label) => dataMap.get(label).Delayed),
					backgroundColor: '#EF4444'
				}
			]
		};
	}

	// Function to determine text color based on the theme mode
	function getThemeColor() {
		const theme = document.documentElement.getAttribute('data-theme');
		return theme === 'dark' ? '#d9dee9' : '#1c252a';
	}

	// Function to create the chart
	function createChart() {
		if (chart) {
			chart.destroy(); // Destroy the existing chart before recreating it
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const chartData = processTasksData(tasks, view);
		const themeColor = getThemeColor(); // Fetch current theme color

		chart = new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						stacked: true,
						title: {
							display: true,
							text: view === 'week' ? 'Weeks' : 'Days',
							font: {
								size: 16,
								weight: 'semi-bold'
							},
							color: themeColor // Set text color dynamically
						},
						ticks: {
							color: themeColor
						},
						grid: {
							display: false
						}
					},
					y: {
						stacked: true,
						beginAtZero: true,
						title: {
							display: true,
							text: 'Number of Tasks',
							font: {
								size: 16,
								weight: 'semi-bold'
							},
							color: themeColor // Set text color dynamically
						},
                        ticks: {
							color: themeColor
						},
						grid: {
							display: true
						}
					}
				},
				plugins: {
					title: {
						display: true,
						text: `Task status by ${view === 'week' ? 'Week' : 'Day'}`,
						font: {
							size: 16,
							weight: 'bold'
						},
						color: themeColor, // Set text color dynamically
						padding: 8
					},
					legend: {
						position: 'top',
						align: 'center',
						labels: {
							padding: 20,
							usePointStyle: true,
							pointStyle: 'circle',
							color: themeColor // Set legend text color dynamically
						}
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const label = context.dataset.label || '';
								const value = context.parsed.y;
								const total = context.chart.data.datasets.reduce(
									(sum, dataset) => sum + dataset.data[context.dataIndex],
									0
								);
								const percentage = ((value / total) * 100).toFixed(1);
								return `${label}: ${value} (${percentage}%)`;
							},
							footer: (tooltipItems) => {
								const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
								return `Total: ${total} tasks`;
							}
						}
					}
				}
			}
		});
	}

	// Mount the chart and ensure it updates on view or tasks change
	$: if (canvas && tasks && view) {
		createChart(); // This will trigger when `tasks` or `view` change
	}

	// OnMount lifecycle to initialize the chart
	onMount(() => {
		if (canvas && tasks) {
			createChart();
		}

		// Update chart on theme change using MutationObserver
		const updateChartOnThemeChange = () => {
			if (chart) {
				createChart();
			}
		};

		const observer = new MutationObserver(updateChartOnThemeChange);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});

		// Cleanup function
		return () => {
			if (chart) {
				chart.destroy();
			}
			observer.disconnect();
		};
	});
</script>

<div class="h-full w-full">
	<canvas bind:this={canvas}></canvas>
</div>
