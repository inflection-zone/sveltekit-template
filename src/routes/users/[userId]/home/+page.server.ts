import type { ServerLoadEvent } from '@sveltejs/kit';
import { getPatientStatistics } from '$routes/api/services/statistics';
import type { PageServerLoad } from './$types';
import { getUserTasks } from '$routes/api/services/user.task';

///////////////////////////////////////////////////////////////////////////////
export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const sessionId = event.cookies.get('sessionId') as string;
	const userId = event.params.userId;
    const response = await getPatientStatistics(sessionId, userId);
    const userProfileData = response.basicData?.userProfileData ?? {};
    const taskCount = response.basicData?.taskCount ?? 0;
    const completedTaskCount = response.basicData?.completedTaskCount ?? 0;
    const pendingTaskCount = response.basicData?.pendingTaskCount ?? 0;
    const healthProfile = response.basicData?.healthProfile ?? {};

    const itemsPerPage = 500;
    const searchParams = {
        userId: userId,
        ActionType: 'CarePlan',
        itemsPerPage: itemsPerPage 
    }

    await getUserTasks(sessionId, searchParams);

    return {
        sessionId,
        userProfileData,
        taskCount,
        completedTaskCount,
        pendingTaskCount,
        healthProfile
    };
};