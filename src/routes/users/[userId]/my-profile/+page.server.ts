import { error, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { upload } from '$routes/api/services/file.resource';
import fs from "fs/promises";
import path from "path";
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '$lib/utils.ts/message.utils';
import { getPatientById, updatePatientById } from '$routes/api/services/user';

///////////////////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		const sessionId = event.cookies.get('sessionId');
		const userId = event.params.userId;
		const response = await getPatientById(sessionId, userId);
		const healthProfile = response.Data;
		return {
			healthProfile,
			sessionId
		};
	} catch (error) {
		console.error(`Error retriving Vitals: ${error}`);
	}
};

const updateUserProfile = zfd.formData({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	gender: z.string().optional(),
	// birthDate: z.string().optional(),
	maritalStatus: z.string().optional(),
	email: z.string().optional(),
	// countryCode: z.string().optional(),
	phone: z.string().optional(),
	race: z.string().optional(),
	ethnicity: z.string().optional(),
	strokeSurvivorOrCaregiver: z.string().optional(),
	workedPriorToStroke: z
		.union([
			z.boolean(),
			z.enum(['true', 'false']).transform((val) => (val === 'false' ? false : true))
		])
		.optional(),
	livingAlone: z
		.union([
			z.boolean(),
			z.enum(['true', 'false']).transform((val) => (val === 'false' ? false : true))
		])
		.optional(),
	addressId: z.string().optional(),
	addressLine: z.string().optional(),
	city: z.string().optional(),
	district: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
	postalCode: z.string().optional(),
	imageResourceId: z.string().optional()
});

export const actions = {
	updateprofile: async (event: RequestEvent) => {
		const request = event.request;
		const userId = event.params.userId;
		const sessionId = event.cookies.get('sessionId');
		const data = await request.formData();
		const formData = Object.fromEntries(data);
		const file = data.get('file') as File;
		console.log('file', file);

		type updateProfileSchema = z.infer<typeof updateUserProfile>;
		let result: updateProfileSchema = {};

		try {
			result = updateUserProfile.parse(formData);
		} catch (err: any) {
			const { fieldErrors: errors } = err.flatten();
			console.log(errors);
			const { ...rest } = formData;
			return {
				data: rest,
				errors
			};
		}

		let imageResourceId: string | null = result.imageResourceId;

		const tempDir = path.resolve("temp");
		try {

			const files = await fs.readdir(tempDir);

			if (files.length === 0) {
				throw new Error("No files found in temp folder.");
			}

			const tempFileName = files[0];
			const filePath = path.join(tempDir, tempFileName);

			const uploadResponse = await upload(sessionId, filePath, tempFileName, true);
			console.log("Upload response:", JSON.stringify(uploadResponse, null, 2));

			if (uploadResponse.Status === "success") {
				imageResourceId = uploadResponse.Data.FileResources[0]?.id || null;
				console.log("Image resource ID:", imageResourceId);
			}

			await fs.unlink(filePath);
		} catch (error) {
			console.error("Error accessing or uploading the file:", error);
		}

		// const phone = result.countryCode + '-' + result.phone;

		const response = await updatePatientById(
			sessionId,
			userId,
			result.firstName,
			result.lastName,
			result.gender,
			// result.birthDate,
			result.maritalStatus,
			result.email,
			result.phone,
			result.race,
			result.ethnicity,
			result.strokeSurvivorOrCaregiver,
			result.workedPriorToStroke,
			result.livingAlone,
			result.addressLine,
			result.city,
			result.district,
			result.state,
			result.country,
			result.postalCode,
			imageResourceId
		);

		if (response.Status == 'failure' || response.HttpCode !== 200) {
			throw redirect(`/users/${userId}/my-profile`, errorMessage(response.Message), event);
		}

		throw redirect(
			303,
			`/users/${userId}/my-profile`,
			successMessage(`Profile updated successfully!`),
			event
		);
	}
};
