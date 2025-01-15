import { BACKEND_API_URL } from "$env/static/private";
import { vitalsFilterData } from "$lib/dashboard.helper/vitals.history.helper";
import { careplanFilterData } from "$lib/dashboard.helper/careplan.helper";
import { CacheService } from "$lib/server/cache/cache.service";
import { Helper } from "$lib/utils.ts/helper";
import { DateStringFormat } from "$lib/utils.ts/time.types";
import { get_ } from "./common";
import { userTasksFilterData } from "$lib/dashboard.helper/tasks.history.helper";
import { basicFilterData } from "$lib/dashboard.helper/basic.helper";

///////////////////////////////////////////////////////////////////////////////

export const getPatientStatistics = async (
	sessionId: string | undefined,
	patientId: string | undefined
) => {
	const url = BACKEND_API_URL + `/patient-statistics/${patientId}/dashboard-summary`;
	const today = Helper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
	const cacheKey = `session-${sessionId}:req-getPatientStatistics:${today}`;
	const yesterday = Helper.getYesterdayDate();
    const yesterdayCacheKey = `session-${sessionId}:req-getPatientStatistics:${yesterday}`;

    if (await CacheService.has(yesterdayCacheKey)) {
        await CacheService._cache.delete(yesterdayCacheKey);
        console.log(`Cleared old key: ${yesterdayCacheKey}`);
    }
    if (await CacheService.has(cacheKey)) {
        return await CacheService.get(cacheKey);
    }
    const result = await get_(url, true, sessionId);
    const resultData = result.Data;
	const basicData = basicFilterData(result);
	const vitalsData = vitalsFilterData(resultData);
	const userTasksData = userTasksFilterData (resultData.CompletedTasks);
	// const careplanData = careplanFilterData(resultData.CarePlanTasks);

	console.log("resultData.CompletedTasks",resultData.CarePlanTasks.length);

	const response = {
		basicData,
		vitalsData,
		userTasksData,
		// careplanData
	};

    await CacheService.set(cacheKey, response);
    return response;
};
