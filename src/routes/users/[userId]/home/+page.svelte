<script lang="ts">
	import { formatBirthdate } from '$lib/utils.ts/functions';
    import type { PageServerData } from './$types';
    export let data: PageServerData;

	///////////////////////////////////////////////////////////////////////////
	
	const {
		userProfileData,
        taskCount,
        completedTaskCount,
        pendingTaskCount,
		healthProfile
	} = data;

	const stats=[{title:"Total tasks",data:taskCount},{title:"Completed tasks",data:completedTaskCount},{title:"Pending tasks",data:pendingTaskCount}]

	const getValue = (value: any): string => {
        if (!value || value.trim?.() === '') {
            return 'Not specified';
        }
        return value;
    };

    const basicInfo = [
        { label: "Name", value: getValue(userProfileData?.DisplayName) },
        { label: "Date of Birth", value: formatBirthdate(getValue(userProfileData?.BirthDate)) },
        { label: "Email", value: getValue(userProfileData?.Email) },
        { label: "Phone", value: getValue(userProfileData?.Phone) },
        { label: "Blood Group", value: getValue(healthProfile?.BloodGroup) },
        // { label: "Health Journey", value: 'Not specified' }
    ];
</script>

<div class="mx-2 sm:mx-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-4">
        {#each stats as stat}
			<div class="status-card">
				<div class="title">{stat.title}</div>
				<div class=" counts">{stat.data}</div>
			</div>
        {/each}
    </div>

    <div class="basic-info-card">
        <h2 class="basic-information">Basic Information</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each basicInfo as info}
                <div>
                    <p class="info-label">{info.label}</p>
                    <p class="mt-1 label">{info.value || 'Not specified'}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

