import { format } from 'date-fns';
// import type { ProcessedChartData } from '$lib/utils.ts/chart.config';

///////////////////////////////////////////////////////////////////////////////
interface UserTask {
    Status: string;
    FinishedAt: string;
    Category: string;
}
interface TableRow {
    date: string;
    category: string;
    count: number;
}
// interface ProcessedData {
//     chartData: ProcessedChartData;
//     tableData: TableRow[];
// }
export function userTasksFilterData(items) {
    // const completedItems = items.filter(item => item.Status === 'Completed');
    console.log('items',items);
    const categoryCountsByDate = items.reduce((acc, item) => {
        const date = new Date(item.FinishedAt);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        if (!acc[dateStr]) {
            acc[dateStr] = {};
        }
        
        const category = item.Category;
        if (!acc[dateStr][category]) {
            acc[dateStr][category] = 1;
        } else {
            acc[dateStr][category]++;
        }
        
        return acc;
    }, {} as Record<string, Record<string, number>>);

    const sortedDates = Object.keys(categoryCountsByDate)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const categories = Array.from(new Set(items.map(item => item.Category)));
    const datasets = categories.map(category => {
        const data = sortedDates
            .map(date => ({
                x: date,
                y: categoryCountsByDate[date][category] || 0
            }))
            .filter(point => point.y > 0);
        return {
            label: category,
            data
        };
    });
    const tableData: TableRow[] = [];
    Object.entries(categoryCountsByDate).forEach(([date, categories]) => {
        Object.entries(categories).forEach(([category, count]) => {
            tableData.push({
                date: format(new Date(date), 'MMM dd, yyyy'), // Format date for display
                category,
                count
            });
        });
    });
    
    tableData.sort((a, b) => {
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison === 0) {
            return a.category.localeCompare(b.category);
        }
        return dateComparison;
    });

    // const userTasksFilterData = {
    //     chartData: { datasets },
    //     tableData
    // }

    return {
        chartData: { datasets },
        tableData
    }
}