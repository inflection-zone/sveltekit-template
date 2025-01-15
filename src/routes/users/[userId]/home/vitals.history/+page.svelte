<script lang="ts">
	import VitalsMain from '$lib/components/home/vitals.main.svelte';
	import type { PageServerData } from './$types';

	///////////////////////////////////////////////////////////////////////////

	export let data: PageServerData;
	let vitalsData = data.vitalsData ?? {};
	let heightData = vitalsData?.height ?? [];
	let weightData = vitalsData.weight ?? [];
	let bloodPressureData = vitalsData.bloodPressure ?? [];
	let glucoseData = vitalsData.glucose ?? [];
	let oxygenSaturationData = vitalsData.oxygenSaturation ?? [];
	let temperatureData = vitalsData.temperature ?? [];
	let pulseData = vitalsData.pulse ?? [];

	let activeVital: string = 'Height';
	const vitals = [
		'Height',
		'Weight',
		'Blood Pressure',
		'Glucose',
		'Oxygen Saturation',
		'Temperature',
		'Pulse'
	];

	$: currentData = (() => {
		switch (activeVital) {
			case 'Height':
				return heightData;
			case 'Weight':
				return weightData;
			case 'Blood Pressure':
				return bloodPressureData;
			case 'Glucose':
				return glucoseData;
			case 'Oxygen Saturation':
				return oxygenSaturationData;
			case 'Temperature':
				return temperatureData;
			case 'Pulse':
				return pulseData;
			default:
				return [];
		}
	})();

	function setActiveVitals(vital: string) {
		activeVital = vital;
	}
</script>

<div>
	<div class="activetasks">
		{#each vitals as vital}
			<button
				class="history"
				on:click={() => setActiveVitals(vital)}
				class:active={activeVital === vital}
			>
				{vital}
			</button>
		{/each}
	</div>
</div>
{#if currentData.length != 0}
	<VitalsMain data={currentData} title={activeVital} />
{:else}
	<p class="not-available my-4 mx-2 sm:mx-8">Data not available for {activeVital}.</p>
{/if}
