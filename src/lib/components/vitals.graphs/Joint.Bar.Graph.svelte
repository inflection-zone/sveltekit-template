<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';

    export let labels: string[] = [];
    export let data1: number[] = [];
    export let data2: number[] = [];

    let barChart: any;
    let ctx: any;

    onMount(() => {
        ctx = barChart.getContext('2d');
        
        // Destroy existing chart if it exists
        if (barChart.chart) {
            barChart.chart.destroy();
        }

        barChart.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data1,
                        backgroundColor: '#4CAF50',  // Matches the green in the image
                        borderColor: '#4CAF50',
                        borderWidth: 0,
                        label: 'Scheduled Task',
                        barPercentage: 0.5,
                        categoryPercentage: 0.8,
                        borderRadius: 2
                    },
                    {
                        data: data2,
                        backgroundColor: '#FF5252',  // Matches the red in the image
                        borderColor: '#FF5252',
                        borderWidth: 0,
                        label: 'Completed Task',
                        barPercentage: 0.5,
                        categoryPercentage: 0.8,
                        borderRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false  // Hide top legend since we show it below
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666',
                            font: {
                                size: 11
                            }
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 1.0,  // Match the y-axis scale in image
                        ticks: {
                            stepSize: 0.1,
                            callback: function(value) {
                                return value.toFixed(1);
                            },
                            color: '#666',
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: '#e5e5e5',
                            drawTicks: false
                        },
                        border: {
                            display: false
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                }
            }
        });
    });
</script>

<div class="relative w-full h-full">
    <canvas bind:this={barChart}></canvas>
</div>

<style>
    canvas {
        width: 100% !important;
        height: 100% !important;
    }
</style>