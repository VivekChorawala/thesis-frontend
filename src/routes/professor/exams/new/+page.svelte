<script lang="ts">
    import { Input, Label, Select } from 'flowbite-svelte';
	import { subjects } from '../../../api/admin/subjects';
	import { professorExams } from '../../../api/professor/exams';
	let apiResponse: any; 
	$: apiResponse = {};
    let isToasterShow: any;
    $: isToasterShow;
    
	import { onMount } from 'svelte';

	import { createForm } from 'svelte-forms-lib';
	import { goto } from '$app/navigation';
	import Toaster from '../../../api/Toaster.svelte';
	let { getAllSubjects, getUser } = subjects();
	let { createExam } = professorExams()
    
    // let user: any = getUser();
    // let user: any = {
    //     email: '', first_name: '', id: '',last_name: '',role: 'professor',status: 'active', token: '', subject_id: ''
    // };
    // $: user;
    
    let category = [
        { value: 'easy', name: 'Easy' },
        { value: 'moderate', name: 'Moderate' },
        { value: 'complex', name: 'Complex' }
    ];
    
    // let subjectList: any = [];
	// $: subjectList;
	// let selectedSubject: number = 0;
	// $: selectedSubject;
	// async function getSubjectList() {
	// 	let apiRes = await getAllSubjects();
	// 	if(apiRes.status == "success") {
	// 		subjectList = apiRes.data;
	//     } else {
	// 		subjectList = [];
	// 	}
	// }

	// onMount(async () => {
    //     user = await getUser();
        
	// 	// await getSubjectList()
	// });
    
    const { form, errors,handleSubmit }: any= createForm({
		initialValues: {
			name: '',
			category: '',
			// subject_id: user.subject_id,
			// professor_id: user.id,
			// started_at: '',
			// finished_at: '',
			status: 'not_started',
            duration: '',
            total_questions: 0,
		},
		validate: values => {
			let errs: any = {};
			if(values.name === "") {
				errs.name = "Please Enter Exam Name";
			}
			
			if(values.category === "") {
				errs.category = "Please Select Category";
			}
			
			if(values.duration === "") {
				errs.duration = "Please Enter Duration";
			}
			// if(values.started_at === "") {
			// 	errs.started_at = "Please Select Start Date";
			// }
			
			// if(values.finished_at === "") {
			// 	errs.finished_at = "Please Select End Date";
			// }
            
            if(values.total_questions <= 0) {
				errs.total_questions = "Please Enter Valid Total Questions";
			}
			
			return errs;
		},
		onSubmit: async (values) => {
            let user = await getUser();
            
			let payload: any = {
                name: values.name,
                category: values.category,
                subject_id: user.subject_id,
                professor_id: user.id,
                // started_at: values.started_at,
                // finished_at: values.finished_at,
                status: values.status,
                duration: values.duration,
                total_questions: +values.total_questions
			}
			
			isToasterShow = false
            let createApi = await createExam(payload);
            apiResponse = createApi;
			
            isToasterShow = createApi.status ? true : false;

            if (apiResponse.status == 'success') {
                setTimeout(() => {
					goto('/professor/exams')
				},1000)
            }
		}
	}); 
  </script>

<main>
	<div class="mx-auto max-w-8xl px-2 sm:px-6 lg:px-0 bg-white mt-10">
		{#if isToasterShow === true}
            <Toaster message="{apiResponse.message}" statusCode="{apiResponse.status}"></Toaster>
		{/if}
		<!-- <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 ml-5">Professor Add new Exam</h1> -->
        <div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">
            <section class="bg-white dark:bg-gray-900">
                <div class="py-4 px-4 mx-auto max-w-2xl">
                    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a New Exam</h2>
                    <form method="post" on:submit|preventDefault={handleSubmit}>
                        <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div class="sm:col-span-2">
                                <Label for="name" class="mb-2">Exam Name</Label>
                                <Input id="name" name="name" type="text" placeholder="Enter Name" on:change{handleChange} bind:value={$form.name}/>
                                {#if $errors.name}
						            <small class="text-red-600">{$errors.name}</small>
					            {/if}
                            </div>
        
                            <div class="sm:col-span-2">
                                <Label>
                                    Select an Category
                                    <Select class="mt-2" items={category} on:change{handleChange} bind:value={$form.category} />
                                    {#if $errors.category}
						            <small class="text-red-600">{$errors.category}</small>
					                {/if}
                                  </Label>
                            </div>
                            <div class="sm:col-span-2">
                                <Label>
                                    Duration
                                    <Input id="duration" name="duration" type="text" placeholder="Enter duration in minutes" on:change{handleChange} bind:value={$form.duration}/>
                                    {#if $errors.duration}
                                        <small class="text-red-600">{$errors.duration}</small>
                                    {/if}
                                  </Label>
                            </div>
                            <!-- <div class="sm:col-span-2">
                                <Label for="start_at" class="mb-2">Start Date</Label>
                                <Input id="start_at" name="started_at" type="datetime-local" placeholder="Select Start Date" on:change{handleChange} bind:value={$form.started_at}/>
                                {#if $errors.started_at}
						            <small class="text-red-600">{$errors.started_at}</small>
                                {/if}
                            </div>

                            <div class="sm:col-span-2">
                                <Label for="finished_at" class="mb-2">End Date</Label>
                                <Input id="finished_at" name="finished_at" type="datetime-local" placeholder="Select End Date" on:change{handleChange} bind:value={$form.finished_at}/>
                                {#if $errors.finished_at}
						            <small class="text-red-600">{$errors.finished_at}</small>
                                {/if}
                            </div> -->

                            <!-- <div class="sm:col-span-2">
                                <Label>
                                    Select Subject
                                    <Select id="subject_id" name="subject_id" class="mt-2" placeholder="Choose Subject" on:change{handleChange} bind:value={$form.subject_id}>
                                    {#each subjectList as item, i}
                                        <option value="{item.id}">{item.name}</option>
                                    {/each}
                                    {#if $errors.subject_id}
						            <small class="text-red-600">{$errors.subject_id}</small>
                                    {/if}
                                    </Select>
                                </Label>
                            </div> -->
                            
                            <div class="sm:col-span-2">
                                <Label for="total_questions" class="mb-2">Total Questions</Label>
                                <Input id="total_questions" name="total_questions" type="number" placeholder="Enter Questions Number" on:change{handleChange} bind:value={$form.total_questions}/>
                                {#if $errors.total_questions}
						            <small class="text-red-600">{$errors.total_questions}</small>
                                {/if}
                            </div>
                            
                        </div>
                        <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Add Exam
                        </button> OR <a href="/professor/exams" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Cancel</a>
                    </form>
                </div>
              </section>
        </div>
        
		
	</div>
</main>
