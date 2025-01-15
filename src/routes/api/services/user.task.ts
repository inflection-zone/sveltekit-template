import { BACKEND_API_URL } from "$env/static/private";
import { CacheService } from "$lib/server/cache/cache.service";
import { Helper } from "$lib/utils.ts/helper";
import { DateStringFormat } from "$lib/utils.ts/time.types";
import { get_ } from "./common";

/////////////////////////////////////////////////////////////////////////////

export const getUserTasks = async (sessionId: string, searchParams?: any) => {
	let searchString = '';
	if (searchParams) {
		const keys = Object.keys(searchParams);
		if (keys.length > 0) {
			searchString = '?';
			const params = [];
			for (const key of keys) {
				if (searchParams[key]) {
					const param = `${key}=${searchParams[key]}`;
					params.push(param);
				}
			}
			searchString += params.join('&');
		}
	}
	const url = BACKEND_API_URL + `/user-tasks/search${searchString}`;
	const today = Helper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
	const cacheKey = `session-${sessionId}:req-getUserTasks:${today}`;
	const yesterday = Helper.getYesterdayDate();
    const yesterdayCacheKey = `session-${sessionId}:req-getUserTasks:${yesterday}`;

    if (await CacheService.has(yesterdayCacheKey)) {
        await CacheService._cache.delete(yesterdayCacheKey);
        console.log(`Cleared old key: ${yesterdayCacheKey}`);
    }
    if (await CacheService.has(cacheKey)) {
        return await CacheService.get(cacheKey);
    }
	const result = await get_(url, true, sessionId);
	await CacheService.set(cacheKey, result);
    return result;
};

export const getEnrollments = async (sessionId: string, patientUserId: string) => {
	const url = BACKEND_API_URL + `/care-plans/patients/${patientUserId}/enrollments`;
	return await get_(url, true, sessionId);
};
