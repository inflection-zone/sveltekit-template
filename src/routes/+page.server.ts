import type { PageServerLoad } from './$types';
import { fail, type Actions, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';
import { generateOtp } from '$routes/api/services/user';
import { validateFormData } from '$lib/utils.ts/validate.form';
import { generateOtpSchema } from './auth/auth.validation.schema';
import { findIdByRoleName, getUserRoles } from './api/services/types';

////////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
	
	event.depends('app');
};

export const actions: Actions = {
	generateOtp: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const { validationResult, validationErrors } = await validateFormData(
			formData,
			generateOtpSchema
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

		const phone = validationResult.countryCode + '-' + validationResult.phone;
		// const phone = validationResult.phone;

		const allRoles = await getUserRoles();

		const loginRoleId = findIdByRoleName(allRoles, 'Patient');

		console.log("loginRoleId",loginRoleId);

		const response = await generateOtp(phone, loginRoleId);

		if (response.Status == 'failure' || response.HttpCode !== 200) {
			throw redirect('/', errorMessage(response.Message), event);
		}
		
		throw redirect(`/sign-in-otp/${phone}`, successMessage(response.Message), event);
	}
};
