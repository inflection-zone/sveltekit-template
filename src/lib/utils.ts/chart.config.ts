import type { ChartConfiguration } from 'chart.js';
import { format, parseISO } from "date-fns";
///////////////////////////////////////////////////////////////////////////////
export interface ChartDataPoint {
    x: string;
    y: number;
}
export interface Dataset {
    label: string;
    data: ChartDataPoint[];
}
export interface ProcessedChartData {
    datasets: Dataset[];
}
// Simple random color generator
function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export function createTimeSeriesConfig(chartData: ProcessedChartData): ChartConfiguration {
    // Generate a new random color for each dataset
    const enhancedDatasets = chartData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
        clip: false
    }));
    return {
        type: 'line',
        data: {
            datasets: enhancedDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM d'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    grid: {
                        // color: '#E5E5E5'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    },
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    },
                    min: 0,
                    max: Math.ceil(Math.max(...enhancedDatasets.flatMap(d => d.data.map(point => point.y)))),
                    grid: {
                        // color: '#E5E5E5'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Tasks by category over Time',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                tooltip: {
                    enabled: true,
                    position: 'nearest',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: 'white',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyColor: 'white',
                    bodyFont: {
                        size: 13
                    },
                    displayColors: true,
                    callbacks: {
                        title: (tooltipItems: any[]) => {
                            if (tooltipItems.length > 0) {
                                const date = tooltipItems[0].raw.x;
                                return format(parseISO(date), 'MMMM d, yyyy');
                            }
                            return '';
                        },
                        label: (context: { dataset: { label: string }; raw: { y: number } }) => {
                            return `${context.dataset.label}: ${context.raw.y} tasks`;
                        }
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    };
}