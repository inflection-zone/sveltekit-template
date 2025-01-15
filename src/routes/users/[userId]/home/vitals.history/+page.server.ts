import { type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPatientStatistics } from '$routes/api/services/statistics';

////////////////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		const sessionId = event.cookies.get('sessionId');
		const userId = event.params.userId;
		const response = await getPatientStatistics(sessionId, userId);
		const vitalsData = response.vitalsData ?? {};
		return {
			sessionId,
			vitalsData
		};
	} catch (error) {
		console.error(`Error retriving Vitals: ${error}`);
	}
};
