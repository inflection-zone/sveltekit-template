import { type RequestEvent, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from '../../$types';
import { loginWithOtp } from '$routes/api/services/user';
import { loginWithOtpSchema } from '$routes/auth/auth.validation.schema';
import { validateFormData } from '$lib/utils.ts/validate.form';
import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';
import { SessionManager } from '$routes/api/sessions/session.manager';
import { CookieUtils } from '$lib/utils.ts/cookie.utils';

//////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		const params = event.params;
		console.log('Loading params' + JSON.stringify(params, null, 2));
		return {
			phone: params.phone
		};
	} catch (error) {
		console.error(
			`Error loading page with params: ${JSON.stringify(event.params)} - ${(error as Error).message}`
		);
	}
};

export const actions = {
	loginWithOtp: async (event: RequestEvent) => {
		const request = event.request;
		const formData = await request.formData();
		const { validationResult, validationErrors } = await validateFormData(
			formData,
			loginWithOtpSchema
		);

		if (validationErrors) {
			return fail(422, {
				validationResult,
				validationErrors
			});
		}

		if (!validationResult) {
			return fail(400, { validationResult: null, validationErrors: errorMessage('Invalid data') });
		}

		const response = await loginWithOtp(validationResult.otp, validationResult.phone);

		if (response.Status == 'failure' || response.HttpCode !== 200) {
			throw redirect('/', errorMessage(response.Message), event);
		}

		const user = response.Data.User;
		user.SessionId = response.Data.SessionId;
		const accessToken = response.Data.AccessToken;
		const expiryDate = new Date(response.Data.SessionValidTill);
		const sessionId = response.Data.SessionId;
		const userId: string = response.Data.User.id;

		const session = await SessionManager.constructSession(user, accessToken, expiryDate);
		if (!session) {
			console.log(`Session cannot be constructed!`);
			throw redirect(303, `/`, errorMessage(`Use login session cannot be created!`), event);
		}
		console.log('Session - ' + JSON.stringify(session, null, 2));

		const userSession = await SessionManager.addSession(session.sessionId as string, session);
		console.log(JSON.stringify(userSession, null, 2));

		CookieUtils.setCookieHeader(event, 'sessionId', sessionId);

		throw redirect(303, `/users/${userId}/home`, successMessage(`Login successful!`), event);
	}
};
