<script lang="ts">
	import { ENABLE_GOOGLE_SIGN_IN } from '../../config';
</script>

<section class="section">
	<div class="absolute top-4 left-4 flex items-center">
		<img src="patient.png" alt="Logo" class="logo" />
		<!-- <h1 class="heading">Patient Portal</h1> -->
	</div>

	<div class="absolute top-4 right-4 flex items-center">
		<a href="/">
			<button class="py-2 px-3 btn">Log in</button>
		</a>
	</div>

	<div class="card">
		<div class="p-6 space-y-4 sm:p-8">
			<form class="space-y-6">
				{#if ENABLE_GOOGLE_SIGN_IN}
					<div class="flex justify-center">
						<button class="googlebtn">
							<img src="google-icon.png" alt="Google" class="w-5 h-5" />
							<span>Continue with Google</span>
						</button>
					</div>
				{/if}

				<div>
					<label for="name" class="label">Full Name</label>
					<input type="text" name="name" id="name" class="input" placeholder="full name" />
				</div>

				<div>
					<label for="email" class="label">Email</label>
					<input type="email" name="email" id="email" class="input" placeholder="email address" />
				</div>

				<div>
					<label for="password" class="label">Password</label>
					<input type="password" name="password" id="password" class="input" placeholder="password" />
				</div>

				<a href="/" class="block w-full">
					<button type="submit" class="btn">Sign up</button>
				</a>

				<p class="para">
					By clicking the button above, you agree to our
					<a href="/" class="anchor">Terms of Service</a> and
					<a href="/" class="anchor">Privacy Policy</a>
				</p>
			</form>
		</div>
	</div>
</section>
