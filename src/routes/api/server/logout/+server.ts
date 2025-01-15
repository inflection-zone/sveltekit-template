
import { CookieUtils } from "$lib/utils.ts/cookie.utils";
import { logout } from "$routes/api/services/user";
import { SessionManager } from "$routes/api/sessions/session.manager";
import { redirect, type RequestEvent } from "@sveltejs/kit";

////////////////////////////////////////////////////////////////

export const POST = async (event: RequestEvent) => {
	const sessionId = event.cookies.get('sessionId');
	if (!sessionId) {
		throw redirect(307, '/');
	}
	try {
		const response = await logout(sessionId);
		console.log('response', JSON.stringify(response));
		if (sessionId) {
			const session = await SessionManager.removeSession(sessionId);
			console.log(JSON.stringify(session, null, 2));
		}
		CookieUtils.removeCookieHeader(event, 'sessionId');
		throw redirect(303, `/`);
	} catch (err) {
		console.error(`Error logging out: ${(err as Error).message}`);
		return new Response((err as Error).message);
	}
};
