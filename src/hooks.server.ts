import type { Handle, HandleServerError } from '@sveltejs/kit';
import { SessionManager } from './routes/api/sessions/session.manager';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('sessionId');
	if (!sessionId) {
		return await resolve(event);
	}

	let sessionUser = null;
	const session = await SessionManager.getSession(sessionId);
	if (session) {
		console.log(`session received`);
		sessionUser = {
			sessionId      : session.sessionId,
            tenantId       : session.tenantId,
            tenantCode     : session.tenantCode,
            tenantName     : session.tenantName,
			userId         : session.userId,
			email          : session.email,
			username       : session.username,
			profileImageUrl: session.profileImageUrl,
			fullName       : session.fullName,
			firstName      : session.firstName,
			roleId         : session.roleId,
            roleName       : session.roleName
		};
	}

	if (sessionUser) {
		event.locals.sessionUser = sessionUser;
	}
	console.log(`returning from hooks`);
	return await resolve(event);
};

export const handleError: HandleServerError = (obj) => {
	const error = obj.error as App.Error;
	const event = obj.event;
	const sessionUser = event.locals.sessionUser;
	let code = error?.code ? error?.code : null;
	if (code == null) {
		if (error?.message?.startsWith('Not found')) {
			code = 400;
		} else {
			code = 500;
		}
	}
	return {
		message: error?.message,
		code: code,
		userId: sessionUser?.userId ?? null,
		stack: error?.stack
	};
};

export function getSession(event) {
	return event?.locals?.sessionUser ?? {};
}
