import { BACKEND_API_URL } from '$env/static/private';
import { delete_, get_, post_, put_ } from './common';
import chalk from 'chalk';

export const getHeights = async (
	sessionId     :       string | undefined,
	searchParams? : any,
) => {
	console.log("getWeights searchParams:", searchParams);
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
	const url =
		BACKEND_API_URL + `/clinical/biometrics/body-heights/search${searchString}`;
		console.log(chalk.red(`url: ${url}`));
	return await get_(url, true, sessionId);
};

export const getGlucose = async (
	sessionId     : string | undefined,
	searchParams? : any,
) => {
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
	const url =
		BACKEND_API_URL + `/clinical/biometrics/blood-glucose/search${searchString}`;
	return await get_(url, true, sessionId);
};

export const getBloodPressure = async (
	sessionId     : string | undefined,
	searchParams? : any,
) => {
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
	const url =
		BACKEND_API_URL + `/clinical/biometrics/blood-pressures/search${searchString}`;
	return await get_(url, true, sessionId);
};

export const getOxygenSaturation = async (
	sessionId     : string | undefined,
	searchParams? : any,
) => {
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
	const url =
		BACKEND_API_URL +
		`/clinical/biometrics/blood-oxygen-saturations/search${searchString}`;
	return await get_(url, true, sessionId);
};

export const getTemperature = async (
	sessionId     : string | undefined,
	searchParams? : any,
) => {
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
	const url =
		BACKEND_API_URL +
		`/clinical/biometrics/body-temperatures/search${searchString}`;
	return await get_(url, true, sessionId);
};

export const getWeights = async (
	sessionId     : string | undefined,
	searchParams?: any,
) => {
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
	const url =
		BACKEND_API_URL + `/clinical/biometrics/body-weights/search${searchString}`;
	return await get_(url, true, sessionId);
};

export const getPulse = async (
	sessionId     : string | undefined,
	searchParams? : any,
) => {
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
	const url = BACKEND_API_URL + `/clinical/biometrics/pulse/search${searchString}`;
	return await get_(url, true, sessionId);
};
