import type { ServerLoadEvent } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { getPatientStatistics } from '$routes/api/services/statistics';

//////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const sessionId = event.cookies.get('sessionId') as string;
    const userId = event.params.userId;
    const response = await getPatientStatistics(sessionId, userId);
    const chartData = response.userTasksData.chartData;
    const tableData = response.userTasksData.tableData;  
    return {
        sessionId,
        chartData,
        tableData
    };
};