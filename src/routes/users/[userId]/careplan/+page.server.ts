import { error, type ServerLoadEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {getUserTasks } from "$routes/api/services/user.task";
import { formatDate, getDayWiseData, getWeekWiseData } from "$lib/utils.ts/functions";
// import { formatDate} from "$lib/utils.ts/functions";
// import { getPatientStatistics } from "$routes/api/services/statistics";

///////////////////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const sessionId = event.cookies.get('sessionId') as string;
    const userId = event.params.userId as string;
    let itemsPerPage = 500;
    let response;
    const searchParams = {
        userId: userId,
        ActionType: 'CarePlan',
        itemsPerPage: itemsPerPage 
    }
    
    response = await getUserTasks(sessionId, searchParams);

    if (response.Status === 'failure' || response.HttpCode !== 200) {
        throw error(response.HttpCode, response.Message || 'An error occurred');
    }

    let  userTasks = response.Data.UserTasks.Items;

    if (userTasks.TotalCount > itemsPerPage) {
        itemsPerPage = userTasks.TotalCount;
        response = await getUserTasks(sessionId, searchParams);
        userTasks = response.Data.UserTasks;
    }  

    const careplanTasks_ = userTasks.reduce((groupedTasks, task) => {
        const planCode = task?.Action?.PlanCode;
        if (planCode) {
            if (!groupedTasks[planCode]) {
                groupedTasks[planCode] = [];
            }
            groupedTasks[planCode].push(task);
        }
        return groupedTasks;
    }, {});

	const firstPlanCode = Object.keys(careplanTasks_)[0];
   	const firstPlanCodeTasks = firstPlanCode ? careplanTasks_[firstPlanCode] : [];
	const careplanTasks = firstPlanCodeTasks.sort((a, b) => {
        const freqA = a?.Action?.Frequency || 0;
        const freqB = b?.Action?.Frequency || 0;
        return freqA - freqB;
    });

	const dayWiseData = getDayWiseData(careplanTasks);
	const weekWiseData = getWeekWiseData(careplanTasks);

    const dayWiseSeparatedData = separateData(dayWiseData);
	const weekWiseSeparatedData = separateData(weekWiseData);

    const { startDate, endDate } = getStartAndEndDates(careplanTasks);

    // const response = await getPatientStatistics(sessionId, userId);

    // const careplanTasks = response.careplanData.careplanTasks;
    // const dayWiseSeparatedData = response.careplanData.dayWiseSeparatedData;
    // const weekWiseSeparatedData = response.careplanData.weekWiseSeparatedData;
    // const startDate = response.careplanData.startDate;
    // const endDate = response.careplanData.endDate;

    return {
        // userTasks,
        sessionId,
        careplanTasks,
        dayWiseSeparatedData,
        weekWiseSeparatedData, 
        startDate,
        endDate,
    };
};

function separateData(data) {
    const labels = Object.keys(data);
    const scheduled = labels.map((label) => data[label].scheduled);
    const completed = labels.map((label) => data[label].completed);
    return { labels, scheduled, completed };
}

function getStartAndEndDates(tasks) {
    if (tasks.length === 0) {
        return { startDate: null, endDate: null };
    }
    const startDate = formatDate(tasks[0].Action.ScheduledAt);
    const endDate = formatDate(tasks[tasks.length - 1].Action.ScheduledAt);
    return { startDate, endDate };
}
