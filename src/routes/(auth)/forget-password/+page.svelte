<script lang="ts">
	import { Label, NavBrand, Navbar, Input } from 'flowbite-svelte';
	import type { PageData } from '../reset-password copy/$types';
	import { forgotPassoword } from '../../../utils/mutations/user';
	import { createForm } from 'svelte-forms-lib';
	import { request } from 'graphql-request';	
	import Toaster from '../../api/Toaster.svelte';
	import { goto } from '$app/navigation';
	export let data: PageData;
	let isToasterShow: boolean = false, apiResponse: any;
	$: isToasterShow, apiResponse;	

	const { form, errors,handleSubmit, handleChange } = createForm({
		initialValues: {
			email: '',
		},
		validate: values => {			
			let errs: any = {};
			
			if(values.email === "") {
				errs.email = "Please Enter Email";
			}
		
			return errs;
		},
		onSubmit: async (values) => {

			const mutation = forgotPassoword;
			const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
				email: values.email
			});

			apiResponse = data.forgotPassword;
			isToasterShow = data.forgotPassword.statusCode ? true : false;
		}
	});
</script>

<div class="flex flex-col justify-center ">
	<Navbar>
		<div>
			<NavBrand href="/">
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAExklEQVR4nO2dz28bRRTHVwiJC0hwAi78+AcqBIeKH1I4ABforT841CmqEbeaW39wwCkIJU0doFXTxKqb2DuzsXdClR9FAWcn+EAoTuixadUDtFXLEdoiCALUDJotkYid/ZGsvbPOfD/Sk6Ik8zzzvjvvPW9mHcMAAAAAAAAAAAAAACDBZLPZB3jF2sEZueAwctFhZnetVntQ9by2PPOThUc4I+9zRm9wRsUas8mP3LYO1SZGH1U9zy1HlZnPOoz0OTa93RT4ZrvLGTnhsNJTqufd8XzDrBccRkzHJv+ECHyj3eM2Oe8w60XV6+jI/O4wMu8X4C+Lw6L8eZ9r8mvOiOfvok6EzO8Os97jjF71DLxNxPTZIWF9+oko9WXXmPzeVGFQOLa3EJzRn1AnGvjqHHnSsUmPw8ivnldwxRSTZ04Jmvu4KfCNRo9/JCbyJ8VsxfTeETb9TdaJuS/o04au8Ap53s3vjP7tFahqueQGk/QfDQx8o5n9R8W505+J6lgxsE7MjZsvGZr1745ffv/aGnGDZx7r2XDgm+xYjxg/NeD69HvNLV0naow97OZ3m1zxC8KMeUbYJ/ujB93DpO8ZsxDUPW2dOlFjo0/I/M4Z+SW4o+ltW+AbLVTn1Ml1osroc5yRvMPon4EdzUBzRxOXydeWxT2gc3LrRLVCXzaSnt+divWanKzf1T67gY6mFJOF6ZwSWydmZk48JCflMLrkN/koHU0pJiPhOicpxDVZJ761rMeUBZ6PjT3u9u8V805sHU1fTBayc5qtmMuyTtTK5WfiC/z42Lb7+Z0sq+xoSjFZyM5p9b7TK+0XwH8i2psBAajSiwACMAigdRoy4iaXSa8MZNJCR8tl0iuxBxwCpNeIoDr+Ru5A+pa2O+BA+prq+Bu5zLtvDWT239Qv+Ptv5DLp142kIP+itWqc0d893jmK1Kvb1zUeosDJm2Ze4zfiJ+o8lBTbIKIGkIdceCsEaMU8jKTBGfk5aNKTZ4c8Fz41Iu/P+4+fGvEevxE/E4VBn/FDwQIyoj73N3L/KAm95Re8w927PBd+eN9uMe2zePmzQ6ndgQIc6d7jK4K8CA7u3ek9j+5dYnp0+J7P7rkub7sbSeXKxbpYz4ICl/rPoo5viZ+u7Xe9xhtJBwIoBgJ0uACXf/i+JSkokh+dU9BlCAABUtgBdaQgpKC6pjVg8UJrinAUP1qnoEUIAAG6sAMEUpCiFLTUovcBkfzovAOWIAAESGEH1JGCkILqmtaAxda8D4jkR+sUtAgBIEAXdoBAClKVgha+a00NiOJH6x2wAAEgQBd2gEAKQgoSWtaASwvzLSnCkfzonIIuQYDNMTdO3lj34yRXD9cW8+4BXK/AH9y7U0wWTvucjB52D94GCXhk3x4xPZrftJ8P3nlbTI3kV7wP59KbDiNvGknDL/hhjpdPFAYDj4XLE9JBAvgF//8ieI0/H2K8PAVuJI2wDzZ4LXy2XIo0ftWiziPMWMcm6p+O1FkAnqQnZIq92WXVH6hRUmTF3g/V7wQIoBgIoBgIoBgIoBgIEDNh2zRdzYhBAM9naGG0/QJs8p8paGNGu+GM/KV6kVxnAXw/jhgm2i4At+kfCDRVtwMAAAAAAAAAAAAAgNGp/AsQg9AyBKdKRQAAAABJRU5ErkJggg==" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Quizcademy</span>
			</NavBrand>
		</div>
	</Navbar>
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			{#if isToasterShow === true}
				<Toaster message="{apiResponse.message}" statusCode="{apiResponse.statusCode}"></Toaster>
			{/if}
			<h2 class="my-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
				Forget Password
			</h2>
		</div>
		
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
				<Label for="email" class="mb-2">Email address
					<Input id="email" name="email" type="email" autocomplete="email" placeholder="Enter Email" on:change{handleChange} bind:value={$form.email}  />
					{#if $errors.email}
						<small class="text-red-600">{$errors.email}</small>
					{/if}
				</Label>

				<div class="mt-5">
					<button	type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						Submit
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
