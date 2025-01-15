export const basicFilterData = (response: any) => {
	const userProfileData = response.Data?.UserProfile ?? {};
	const taskCount = response.Data?.TaskCount ?? 0;
	const completedTaskCount = response.Data?.CompletedTaskCount ?? 0;
	const pendingTaskCount = response.Data?.PendingTaskCount ?? 0;
	const healthProfile = response.Data?.HealthProfile ?? {};

	return {
		userProfileData,
		taskCount,
		completedTaskCount,
		pendingTaskCount,
		healthProfile
	};
};
