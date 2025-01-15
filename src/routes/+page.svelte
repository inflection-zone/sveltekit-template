<script lang="ts">
	import {
		getPublicFooterLink,
		getPublicFooterText,
		getPublicLogoImageSource
	} from '$lib/components/themes/theme.selector';
	import CountryCode from '$lib/components/country.code.svelte';
	// import { loginMethods } from '../config';
	import Icon from '@iconify/svelte';
	import { SystemTypes } from '$lib/system.types';
	import { SYSTEM_ID } from '$lib/constants';

	//////////////////////////////////////////////////////////////////////

	const systemType: SystemTypes = SYSTEM_ID as SystemTypes;
	console.log('systemType:', systemType);
	let showPassword = false;
	let loginMethod = 'mobile';
	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	const logoImageSource = getPublicLogoImageSource();
	const footerText = `© ${new Date().getFullYear()} ${getPublicFooterText()}`;
	const footerLink = getPublicFooterLink();
	let countryCode;

	// if (systemType === SystemTypes.AHA) {
	//     countryCode = '+1'
	// }
</script>

<section class="section min-h-screen flex flex-col">
	<div class="absolute top-4 left-4 flex items-center">
		<img src={logoImageSource} alt="Logo" class="px-4 w-32 h-auto"/>
		<!-- <h1 class="heading">Patient Portal</h1> -->
	</div>

	<!-- <div class="absolute top-4 right-4 flex items-center">
		<a href="/signup">
			<button class="py-2 px-3 btn">Sign Up</button>
		</a>
	</div> -->

	<div class="card">
		<div class="p-8">
			<h1 class="text-xl text-info font-semibold">Login</h1>
			<p class=" text-sm mt-1  mb-4 text-gray-500">
				Enter your mobile number below to login to your account.
			</p>
			<form method="post" action="?/generateOtp" class="space-y-6">
				<!-- <div>
					<div class="flex space-x-4">
						{#each loginMethods as { value, label }}
							<label class="label">
								<input type="radio" name="loginMethod" {value} bind:group={loginMethod} />
								{label}
							</label>
						{/each}
					</div>
				</div> -->

				{#if loginMethod === 'mobile'}
					<div id="mobile-login">
						<label for="mobile" class="label">Mobile Number</label>
						<div class="flex space-x-2">
							<!-- <select class="selectcode" name="countryCode">
								<option value="+1">+1</option>
								<option value="+91">+91</option>
								<option value="+44">+44</option>
								<option value="+61">+61</option>
							</select> -->
							{#if systemType === SystemTypes.AHA}
								<select name="countryCode" class="selectcode" required>
									<option value="+1">+1</option>
								</select>
							{:else}
								<CountryCode />
							{/if}
							<!-- <input hidden type="text" name='countryCode' bind:value={countryCode}>  -->
							<input
								type="tel"
								name="phone"
								pattern="[0-9]*"
								inputmode="numeric"
								id="mobile"
								class="mobileinput"
								placeholder="Your mobile number"
								required
							/>
						</div>
					</div>
				{:else if loginMethod === 'username'}
					<div id="username-login">
						<label for="username" class="label">Username</label>
						<input
							type="text"
							name="username"
							id="username"
							class="input"
							placeholder="Your username"
						/>
						<label for="password" class="label">Password</label>
						<div class="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								id="password"
								class="input"
								placeholder="Your password"
							/>
							<button type="button" class="eyebtn" on:click={togglePasswordVisibility}>
								<Icon
									icon={showPassword ? 'ic:round-visibility-off' : 'ic:round-visibility'}
									class="text-xl"
								/>
							</button>
						</div>
					</div>
				{:else if loginMethod === 'email'}
					<div id="email-login">
						<label for="email" class="label">Email</label>
						<input type="email" name="email" id="email" class="input" placeholder="Your email" />
					</div>
				{/if}

				<button type="submit" class="btn w-full">Generate OTP</button>

				<!-- <p class="para">
					Don’t have an account?
					<a href="/signup" class="font-medium text-gray-900 hover:underline px-1">Sign up</a>
				</p> -->
			</form>
		</div>
	</div>
	<footer class="fixed bottom-0 w-full text-center py-4">
		<a href={footerLink} class="!text-black">{footerText}</a>
	</footer>
</section>
