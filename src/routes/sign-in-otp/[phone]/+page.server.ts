// import { type RequestEvent, error } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';
// import { loginWithOtp } from '../api/services/user';
// import { redirect } from 'sveltekit-flash-message/server';
// import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';
// import { formData } from 'zod-form-data';

// export const load:PageServerLoad = async (event: RequestEvent) => {
//     let phone = event.url.searchParams.get('phone')
//     if (!phone) {
//         throw error(500,'Invalid url')
//     }
//     return {
//         phone : phone,
//     }
// }

// export const actions = {
// 	login: async (event: RequestEvent) => {
// 		const request = event.request;
//         const data = Object.fromEntries(await request.formData());;
//         console.log('Form Data Input', formData);
//         const otp = data.otp as string;
//         const phone = data.phone as string;
//         console.log('OTPPP: ' + otp);
//         const response = await loginWithOtp(otp, phone);
//         if (response.Status === 'failure' || response.HttpCode !== 200) {
//             console.log(response.Message);
//             throw redirect(303, '/', errorMessage('Incorrect OTP. Please try again.'), event);
//         }

//         const user = response.Data.User;
//         user.SessionId = response.Data.SessionId;

//         const userId: string = response.Data.User.id;

//         console.log("response",response)

//         if (user.Role.RoleName !== 'Patient') {
//             throw redirect(303, `/`, errorMessage(`Unsupported user role!`), event);
//         }

//         throw redirect(303, `/dashboard`, successMessage(`Login successful!`), event);
// 	}
// };
import { type Actions, type RequestEvent} from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from '../../$types.js';
import { generateOtp, loginWithOtp } from '$routes/api/services/user';
// import { loginWithOtpSchema } from '$routes/auth/auth.validation.schema';
// import { validateFormData } from '$lib/utils.ts/validate.form';
import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';
import { SessionManager } from '$routes/api/sessions/session.manager';
import { CookieUtils } from '$lib/utils.ts/cookie.utils';
import { findIdByRoleName, getUserRoles } from '$routes/api/services/types.js';

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

export const actions: Actions = {
	loginWithOtp: async (event: RequestEvent) => {
		const request = event.request;
		// const data = Object.fromEntries(await request.formData());; // or .json(), or .text(), etc
        // console.log('Form Data Input', data);
        // const otp = data.otp as string;
        // const phone = data.phone as string;
        // console.log('OTPPP: ' + otp);
		// console.log('PHONE: ' + phone);
		// const formData = await request.formData();
		// const { validationResult, validationErrors } = await validateFormData(
		// 	formData,
		// 	loginWithOtpSchema
		// );

		// if (validationErrors) {
		// 	return fail(422, {
		// 		validationResult,
		// 		validationErrors
		// 	});
		// }

		// if (!validationResult) {
		// 	return fail(400, { validationResult: null, validationErrors: errorMessage('Invalid data') });
		// }

		// console.log('Validation Result: ' + JSON.stringify(validationResult, null, 2));
		// const response = await loginWithOtp(validationResult.otp, validationResult.phone);

		const data = Object.fromEntries(await request.formData());
        const otp = data.otp as string;
        const phone = data.phone as string;

		const allRoles = await getUserRoles();

		const loginRoleId = findIdByRoleName(allRoles, 'Patient');
		
        const response = await loginWithOtp(otp, phone, loginRoleId);

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
	},

	generateOtp: async (event: RequestEvent) => {
        const form = await event.request.formData();
        const phone = form.get('phone') as string;

        if (!phone) {
            throw redirect(
                303,
                event.url.pathname,
                errorMessage('Phone number is required'),
                event
            );
        }

        try {
            const allRoles = await getUserRoles();
            const loginRoleId = findIdByRoleName(allRoles, 'Patient');
            
            const response = await generateOtp(phone, loginRoleId, "Login");

            if (response.Status === "failure" || response.HttpCode !== 200) {
                throw redirect(
                    303,
                    event.url.pathname,
                    errorMessage(response.Message || 'Failed to generate OTP'),
                    event
                );
            }

            return {
                success: true
            };

        } catch (error) {
            console.error('Error in generateOtp:', error);
            throw redirect(
                303,
                event.url.pathname,
                errorMessage('Failed to generate OTP'),
                event
            );
        }
    }

};
