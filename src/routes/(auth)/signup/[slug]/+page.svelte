<script lang="ts">
	import type { PageData } from './$types';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { createForm } from 'svelte-forms-lib';
	import { Select, Label, Input, Navbar, NavBrand, Button } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { request } from 'graphql-request';
	import Toaster from '../../../api/Toaster.svelte'; // Replace with the actual path
	import { signUpMutation } from '../../../../utils/mutations/user';
	import { onMount } from 'svelte';
	import { subjects } from '../../../api/admin/subjects';

	let slug = $page.params.slug;

	$: isToasterShow = false;
	$: apiResponse = {};
	const slugArr = ['student', 'professor'];
	if (!slugArr.includes(slug)) {
		throw redirect(301, '/signin');
	}

	let page_name = slug.charAt(0).toUpperCase() + slug.slice(1);
	let { getAllSubjects } = subjects();

	export let data: PageData;

	// let subjects = [
	// 	{ value: 1, name: 'Maths' },
	// 	{ value: 2, name: 'English' },
	// 	{ value: 3, name: 'Science' },
	// 	{ value: 4, name: 'Hindi' }
	// ];

	let subjectList: any = [];
	$: subjectList;
	let selectedSubject: number = 0;
	$: selectedSubject;
	async function getSubjectList() {
		let apiRes = await getAllSubjects();
		if(apiRes.status == "success") {
			subjectList = apiRes.data;
	} else {
			subjectList = [];
		}
	}

	onMount(async () => {
		await getSubjectList()
	});

	function selectSubject(event: any) {
		form.subject = Number(event.target.value);
	}
	const { form, errors,handleSubmit, handleChange }: any= createForm({
		initialValues: {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			confirm_password: '',
			role: slug,
			subject: ''
		},
		validate: values => {
			
			let errs: any = {};
			if(values.first_name === "") {
				errs.first_name = "Please Enter First Name";
			}
			
			if(values.last_name === "") {
				errs.last_name = "Please Enter last Name";
			}
			
			if(values.email === "") {
				errs.email = "Please Enter Email";
			}
			if(values.password === "") {
				errs.password = "Please Enter password";
			}
			
			if(values.confirm_password === "") {
				errs.confirm_password = "Please Enter Confirm password";
			}
			
			if(values.password !== values.confirm_password) {
				errs.confirm_password = "Password and Confirm Password should match"
			}
			
			if(values.role == 'professor' && values.subject === '') {
				errs.subject = "Please Select Subject"
			}
			return errs;
		},
		onSubmit: async (values) => {
			const mutation = signUpMutation;
			let payload: any = {
				email: values.email,
				first_name: values.first_name,
				last_name: values.last_name,
				password: values.password,
				role: values.role
			}
			if (slug == 'professor') {
				payload['subject'] = values.subject
			}
			const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
				userSignupInput: payload
			});

			isToasterShow = data.userSignup.statusCode ? true : false;
			apiResponse = data.userSignup;
			if (isToasterShow) {
				setTimeout(() => {
					isToasterShow = false;
					slug == 'professor' ? goto('/signin/professor') : goto('/signin/student');
				}, 500);
			}
		}
	});
</script>

<div class="flex flex-col justify-center">
	<Navbar>
		<div>
			<NavBrand href="/">
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAExklEQVR4nO2dz28bRRTHVwiJC0hwAi78+AcqBIeKH1I4ABforT841CmqEbeaW39wwCkIJU0doFXTxKqb2DuzsXdClR9FAWcn+EAoTuixadUDtFXLEdoiCALUDJotkYid/ZGsvbPOfD/Sk6Ik8zzzvjvvPW9mHcMAAAAAAAAAAAAAACDBZLPZB3jF2sEZueAwctFhZnetVntQ9by2PPOThUc4I+9zRm9wRsUas8mP3LYO1SZGH1U9zy1HlZnPOoz0OTa93RT4ZrvLGTnhsNJTqufd8XzDrBccRkzHJv+ECHyj3eM2Oe8w60XV6+jI/O4wMu8X4C+Lw6L8eZ9r8mvOiOfvok6EzO8Os97jjF71DLxNxPTZIWF9+oko9WXXmPzeVGFQOLa3EJzRn1AnGvjqHHnSsUmPw8ivnldwxRSTZ04Jmvu4KfCNRo9/JCbyJ8VsxfTeETb9TdaJuS/o04au8Ap53s3vjP7tFahqueQGk/QfDQx8o5n9R8W505+J6lgxsE7MjZsvGZr1745ffv/aGnGDZx7r2XDgm+xYjxg/NeD69HvNLV0naow97OZ3m1zxC8KMeUbYJ/ujB93DpO8ZsxDUPW2dOlFjo0/I/M4Z+SW4o+ltW+AbLVTn1Ml1osroc5yRvMPon4EdzUBzRxOXydeWxT2gc3LrRLVCXzaSnt+divWanKzf1T67gY6mFJOF6ZwSWydmZk48JCflMLrkN/koHU0pJiPhOicpxDVZJ761rMeUBZ6PjT3u9u8V805sHU1fTBayc5qtmMuyTtTK5WfiC/z42Lb7+Z0sq+xoSjFZyM5p9b7TK+0XwH8i2psBAajSiwACMAigdRoy4iaXSa8MZNJCR8tl0iuxBxwCpNeIoDr+Ru5A+pa2O+BA+prq+Bu5zLtvDWT239Qv+Ptv5DLp142kIP+itWqc0d893jmK1Kvb1zUeosDJm2Ze4zfiJ+o8lBTbIKIGkIdceCsEaMU8jKTBGfk5aNKTZ4c8Fz41Iu/P+4+fGvEevxE/E4VBn/FDwQIyoj73N3L/KAm95Re8w927PBd+eN9uMe2zePmzQ6ndgQIc6d7jK4K8CA7u3ek9j+5dYnp0+J7P7rkub7sbSeXKxbpYz4ICl/rPoo5viZ+u7Xe9xhtJBwIoBgJ0uACXf/i+JSkokh+dU9BlCAABUtgBdaQgpKC6pjVg8UJrinAUP1qnoEUIAAG6sAMEUpCiFLTUovcBkfzovAOWIAAESGEH1JGCkILqmtaAxda8D4jkR+sUtAgBIEAXdoBAClKVgha+a00NiOJH6x2wAAEgQBd2gEAKQgoSWtaASwvzLSnCkfzonIIuQYDNMTdO3lj34yRXD9cW8+4BXK/AH9y7U0wWTvucjB52D94GCXhk3x4xPZrftJ8P3nlbTI3kV7wP59KbDiNvGknDL/hhjpdPFAYDj4XLE9JBAvgF//8ieI0/H2K8PAVuJI2wDzZ4LXy2XIo0ftWiziPMWMcm6p+O1FkAnqQnZIq92WXVH6hRUmTF3g/V7wQIoBgIoBgIoBgIoBgIEDNh2zRdzYhBAM9naGG0/QJs8p8paGNGu+GM/KV6kVxnAXw/jhgm2i4At+kfCDRVtwMAAAAAAAAAAAAAgNGp/AsQg9AyBKdKRQAAAABJRU5ErkJggg==" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Quizcademy</span>
			</NavBrand>
		</div>
		<div class="flex items-center justify-between">
			<Button  class="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
				<a href="/signin/{slug == 'student' ? 'professor' : 'student'}">Sign In as {slug == 'student' ? 'Professor' : 'Student'}</a>
			</Button>
		</div>
	</Navbar>
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			{page_name} SignUp
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
		{#if isToasterShow === true}
			<Toaster message="{apiResponse.message}" statusCode="{apiResponse.statusCode}"></Toaster>
		{/if}
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			<form class="space-y-6" method="post" on:submit|preventDefault={handleSubmit}>
				<div>
					<Label for="first_name" class="mb-2">First name</Label>
					<Input type="text" id="first_name" name="first_name" placeholder="Enter First Name" on:change{handleChange} bind:value={$form.first_name}  />
					{#if $errors.first_name}
						<small class="text-red-600">{$errors.first_name}</small>
					{/if}
				  </div>
				<div>
					
				<div>
					<Label for="last_name" class="mb-2">Last name</Label>
					<Input type="text" id="last_name" name="last_name" placeholder="Enter Last Name" on:change{handleChange} bind:value={$form.last_name}  />
					</div>
					{#if $errors.last_name}
						<small class="text-red-600">{$errors.last_name}</small>
					{/if}
				<div>
					
				<div class="mb-6 mt-5">
					<Label for="email" class="mb-2">Email address</Label>
					<Input id="email" name="email" type="email" autocomplete="email" placeholder="Enter Email" on:change{handleChange} bind:value={$form.email}  />
					{#if $errors.email}
						<small class="text-red-600">{$errors.email}</small>
					{/if}
				</div>
					
				<div class="mb-6">
					<Label for="password" class="mb-2">Password</Label>
					<Input type="password" id="password" name="password" placeholder="•••••••••" on:change{handleChange} bind:value={$form.password}  />
					{#if $errors.password}
						<small class="text-red-600">{$errors.password}</small>
					{/if}
				</div>
				  
				<div class="mb-6">
					<Label for="confirm_password" class="mb-2">Confirm password</Label>
					<Input type="password" id="confirm_password" name="confirm_password" placeholder="•••••••••" on:change{handleChange} bind:value={$form.confirm_password}   />
					{#if $errors.confirm_password}
						<small class="text-red-600">{$errors.confirm_password}</small>
					{/if}
				</div>

				{#if slug === 'professor'}
					<div class="mt-2 md:grid-cols-2 w-full">
						<Label>
							Select Subject
							<Select name="subject" class="mt-2" placeholder="Choose Subject" on:change={selectSubject} bind:value={$form.subject}>
								<!-- <option value="">Choose One</option> -->
							{#each subjectList as item, i}
								<option value="{item.id}">{item.name}</option>
							{/each}
							{#if $errors.subject}
								<small class="text-red-600">{$errors.subject}</small>
							{/if}
							</Select>
						</Label>
					</div>
				{/if}

				<div class="mt-5">
					<button	type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						Sign Up
					</button>
				</div>
			</form>
		</div>
		<div class="flex items-center justify-center mt-10 text-center text-sm text-gray-500">
			<Button  class="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
				<a href="/signin/{slug}">Sign In as {page_name}</a>
			</Button>
		</div>
	</div>
</div>
