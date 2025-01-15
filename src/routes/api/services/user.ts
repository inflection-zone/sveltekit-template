import { BACKEND_API_URL } from '$env/static/private';
import { CacheService } from '$lib/server/cache/cache.service';
import { post_, get_, delete_, put_ } from './common';

///////////////////////////////////////////////////////////////////////////////

export const generateOtp = async (phone: string, loginRoleId?: number, purpose?: string) => {
	const url = BACKEND_API_URL + `/users/generate-otp`;
	const body = {
		Phone: phone,
		RoleId: loginRoleId ? loginRoleId : 2,
		Purpose: purpose ? purpose : 'Login'
	};
	return await post_(url, body);
};

export const loginWithOtp = async (otp: string, phone: string, loginRoleId: number = 2) => {
	const url = BACKEND_API_URL + `/users/login-with-otp`;
	const body = {
		Phone: phone,
		Otp: otp,
		LoginRoleId: loginRoleId ?? 2
	};
	return await post_(url, body);
};

export const getPatientById = async (
	sessionId: string | undefined,
	patientId: string | undefined
) => {
	const url = BACKEND_API_URL + `/patients/${patientId}`;
	const cacheKey = `session-${sessionId}:req-getPatientById`;
	if (await CacheService.has(cacheKey)) {
        return await CacheService.get(cacheKey);
    }
	const result = await get_(url, true, sessionId);
	await CacheService.set(cacheKey, result);
	return result;
};

export const logout = async (sessionId: string) => {
	const url = BACKEND_API_URL + `/users/logout`;
	const result = await post_(url, {}, true, sessionId);
	// const findAndClearKeys = [`req-getUserRoles`];
	await CacheService.clear();
	return result;
};

export const deletePatient = async (sessionId: string, patientId: string) => {
	const url = BACKEND_API_URL + `/patients/${patientId}`;
	const result = await delete_(url, true, sessionId);
	await CacheService.clear();
	return result;
};

export const updatePatientById = async (
	sessionId: string | undefined,
	patientId: string | undefined,
	firstName: string,
	lastName: string,
	gender: string,
	// birthDate: string,
	maritalStatus: string,
	email: string,
	phone: string,
	race: string,
	ethnicity: string,
	strokeSurvivorOrCaregiver: string,
	workedPriorToStroke: boolean,
	livingAlone: boolean,
	addressLine: string,
	city: string,
	district: string,
	state: string,
	country: string,
	postalcode: string,
	imageresourceid: string
) => {
	console.log('in the user update living alone');
	const body = {
		FirstName: firstName ? firstName : null,
		LastName: lastName ? lastName : null,
		Gender: gender ? gender : null,
		// BirthDate: birthDate ? birthDate : null,
		MaritalStatus: maritalStatus ? maritalStatus : null,
		Email: email ? email : null,
		Phone: phone ? phone : null,
		Race: race ? race : null,
		Ethnicity: ethnicity ? ethnicity : null,
		StrokeSurvivorOrCaregiver: strokeSurvivorOrCaregiver ? strokeSurvivorOrCaregiver : null,
		WorkedPriorToStroke:
			workedPriorToStroke !== undefined && workedPriorToStroke !== null
				? workedPriorToStroke
				: null,
		LivingAlone: livingAlone !== undefined && livingAlone !== null ? livingAlone : null,

		AddressLine: addressLine ? addressLine : null,
		City: city ? city : null,
		District: district ? district : null,
		State: state ? state : null,
		Country: country ? country : null,
		PostalCode: postalcode ? postalcode : null,
		ImageResourceId: imageresourceid ? imageresourceid : null
	};
	console.log('in the user update', body);
	const url = BACKEND_API_URL + `/patients/${patientId}`;
	const findAndClearKeys = [`session-${sessionId}:req-getPatientById`];
	await CacheService.findAndClear(findAndClearKeys)
	return await put_(url, body, true, sessionId);
};
