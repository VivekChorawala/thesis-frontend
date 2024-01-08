<script lang="ts">
	import type { PageData } from './$types';
	import { createForm } from 'svelte-forms-lib';
	export let data: PageData;

	const { form, handleSubmit, handleChange } = createForm({
		initialValues: {
			email: '',
			password: '',
			passwordConfirmation: '',
			role: 'student'
		},
		onSubmit: ({ email, password, passwordConfirmation, role }) => {
			console.log({ email, password, passwordConfirmation, role });
		}
	});
</script>

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Quizcademy
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
				<div>
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={$form.email}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
						>Password</label
					>
					<div class="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							bind:value={$form.password}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<label
						for="passwordConfirmation"
						class="block text-sm font-medium leading-6 text-gray-900">Password Confirmation</label
					>
					<div class="mt-2">
						<input
							id="passwordConfirmation"
							name="passwordConfirmation"
							type="password"
							autocomplete="current-password"
							required
							bind:value={$form.passwordConfirmation}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<label for="role" class="block text-sm font-medium leading-6 text-gray-900"
						>Who are you?</label
					>
					<div class="mt-2 grid gap-6 md:grid-cols-2">
						<div class="flex items-center">
							<input
								id="student"
								name="role"
								type="radio"
								value="student"
								on:change={handleChange}
								checked={$form.role == 'student'}
								class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
							/>
							<label for="push-email" class="w-full py-4 ms-2 text-sm font-medium text-gray-900"
								>Student</label
							>
						</div>
						<div class="flex items-center">
							<input
								id="professor"
								name="role"
								type="radio"
								value="professor"
								on:change={handleChange}
								checked={$form.role == 'professor'}
								class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
							/>
							<label
								for="push-everything"
								class="w-full py-4 ms-2 text-sm font-medium text-gray-900">Professor</label
							>
						</div>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>Sign up</button
					>
				</div>
			</form>
		</div>

		<p class="mt-10 text-center text-sm text-gray-500">
			Already have an account?
			<a href="/signin" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
				>Login</a
			>
		</p>
	</div>
</div>
