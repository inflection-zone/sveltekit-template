import { BACKEND_API_URL } from "$env/static/private";
import { get_ } from "./common";

/////////////////////////////////////////////////////////////////////////////

export const getNotifications = async (sessionId: string, searchParams?: Record<string, string>) => {
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
	const url = BACKEND_API_URL + `/general/notifications/search${searchString}`;
	return await get_(url, true, sessionId);
};
