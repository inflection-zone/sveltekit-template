<script lang="ts">
    import { enhance } from '$app/forms';
    import Success from '$lib/components/icons/success.icon.svelte';
    import { getPublicLogoImageSource } from '$lib/components/themes/theme.selector';
    import Toast from '$lib/components/toast/toast.svelte';
    import type { PageServerData } from './$types';
    import { onMount, onDestroy } from 'svelte';
    ////////////////////////////////////////////////////////////////////////////
    export let data: PageServerData;
    let phone = data.phone;
    console.log('Phone: ' + phone);
    let enteredOtp: string;
    let otp: string[] = ['', '', '', '', '', ''];
    let otpInputs: Array<HTMLInputElement> = [];
    $: console.log(otp);
    let duration = 300;
    let timer = '05:00';
    let isTimerExpired = false;
    let interval: ReturnType<typeof setInterval>;
    let isResending = false;
    let isSubmitting = false;
    $: enteredOtp = otp.join('');
    $: console.log('OTP input elements', enteredOtp);
    $: console.log('Enter OTP input', enteredOtp);
    const logoImageSource = getPublicLogoImageSource();
    const handleOtpInput = (index: number) => {
        otp[index] = otp[index].replace(/\D/g, '');
        if (index < otpInputs.length - 1 && otp[index].length === 1) {
            otpInputs[index + 1].focus();
        }
    };
    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
    function updateTimer() {
        if (duration > 0) {
            duration--;
            timer = formatTime(duration);
        } else {
            isTimerExpired = true;
            clearInterval(interval);
        }
    }
    function resetOtpAndTimer() {
        duration = 300;
        isTimerExpired = false;
        timer = formatTime(duration);
        otp = ['', '', '', '', '', ''];
        otpInputs[0]?.focus();
        clearInterval(interval);
        interval = setInterval(updateTimer, 1000);
    }
    const handleResendSubmit = () => {
        if (isResending || isSubmitting) return;
        isResending = true;
        isSubmitting = true;
        return async ({ update }: any) => {
            try {
                await update();
                resetOtpAndTimer();
            } finally {
                isResending = false;
                isSubmitting = false;
            }
        };
    };
    onMount(() => {
        interval = setInterval(updateTimer, 1000);
    });
    onDestroy(() => {
        clearInterval(interval);
    });
</script>
<section class="section">
    <div class="absolute top-4 left-4 flex items-center">
        <!-- <img src="/patient.png" alt="Logo" class="logo" /> -->
        <!-- <h1 class="heading">Patient Portal</h1> -->
        <img src={logoImageSource} alt="Logo" class="px-4 w-32 h-auto"/>
    </div>
    <!-- <div class="absolute top-4 right-4 flex items-center">
        <a href="/signup">
            <button class=" py-2 px-3 btn"> Sign Up </button>
        </a>
    </div> -->
    <div class="card">
        <div class="p-8">
            <form method="post" action="?/loginWithOtp" use:enhance>
                <div>
                    <label for="otp" class="label"> Enter OTP </label>
                    <div class="flex space-x-2">
                        {#each Array(6) as _, i}
                            <input
                                type="tel"
                                bind:value={otp[i]}
                                on:input={() => handleOtpInput(i)}
                                maxlength="1"
                                pattern="[0-9]"
                                inputmode="numeric"
                                class="inputotp"
                                bind:this={otpInputs[i]}
                                required
                            />
                        {/each}
                    </div>
                    {#if !isTimerExpired}
                        <div class=" otp-expires">OTP expires in {timer}</div>
                    {:else}
                        <div class="resend-otp">
                            <span>Didn't receive OTP ?</span>
                            {#if !isSubmitting}
                                <!-- svelte-ignore node_invalid_placement_ssr -->
                                <form
                                    method="POST"
                                    action="?/generateOtp"
                                    use:enhance={handleResendSubmit}
                                    class="inline"
                                >
                                    <input type="hidden" name="phone" value={phone} />
                                    <button
                                        type="submit"
                                        class="text-info hover:text-primary-700 ml-1"
                                        disabled={isResending}
                                    >
                                        {isResending ? 'Sending...' : 'Resend OTP'}
                                    </button>
                                </form>
                            {/if}
                        </div>
                    {/if}
                    <input hidden type="text" name="otp" bind:value={enteredOtp} />
                    <input hidden type="text" name="phone" bind:value={phone} />
                </div>
                <button type="submit" class="btn"> Submit </button>
                <!-- <p class="para">
                    Don’t have an account?
                    <a href="/signup" class="anchor"> Sign up </a>
                </p> -->
            </form>
        </div>
    </div>
</section>