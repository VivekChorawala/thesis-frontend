<script lang="ts">
	import { page } from '$app/stores';
    import { Input, Label, Helper, Button, Checkbox, A, Textarea,Select,Datepicker, Toast, Spinner } from 'flowbite-svelte';
    import { onMount } from 'svelte';
	import moment from 'moment';
	
    import { professorExams } from '../../../../api/professor/exams';
	import { subjects } from '../../../../api/admin/subjects';
	
	import { createForm } from 'svelte-forms-lib';
	import Toaster from '../../../../api/Toaster.svelte';
	import { goto } from '$app/navigation';
	let examID = $page.params.id;
	let examData: any = [];
	let isToasterShow: any, loading: any = false;
	$: examData;
    $: isToasterShow;
	let apiResponse: any; 
	$: apiResponse = {};
	// let user: any = {
    //     email: '', first_name: '', id: '',last_name: '',role: 'professor',status: 'active', token: ''
    // };
	let category = [
        { value: 'easy', name: 'Easy' },
        { value: 'moderate', name: 'Moderate' },
        { value: 'complex', name: 'Complex' }
    ];

	$: activeUrl = $page.url.pathname;
	
	const { getExamByExamId, getUser, editExam } = professorExams();
	// let { getAllSubjects } = subjects();
	
	
	const getExamsDetails = async() => {
      
      let apiCall = await getExamByExamId(examID);
      
      if(apiCall.status == 'success') {
        examData = apiCall.data[0];
		$form.id = examData.id;
		$form.name = examData.name;
		$form.category = examData.category;
		$form.subject_id = examData.subject_id;
		$form.professor_id = examData.professor_id
		$form.status = examData.status;
		// $form.started_at = moment(examData.started_at).format('YYYY-MM-DDTHH:mm');
		// $form.finished_at = moment(examData.finished_at).format('YYYY-MM-DDTHH:mm');
		$form.duration = examData.duration;
		$form.total_questions = examData.total_questions
      } else {
        console.log(apiCall.message);
      }
    }
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
	
	onMount(async () => {
		// user = getUser();
		loading = true;
        await getExamsDetails()
		loading = false;
		// await getSubjectList()
    })
	
	const { form, errors,handleSubmit }: any= createForm({
		initialValues: {
			id: '',
			name: '',
			category: '',
			// subject_id: '',
			// professor_id: '',
			// started_at: '',
			// finished_at: '',
			status: 'not_started',
            duration: '',
			total_questions: 0
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
			
			return errs;
		},
		onSubmit: async (values) => {
			let user = await getUser();
			
			const payload: any = {
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
            let editApi = await editExam(examID, payload);
            apiResponse = editApi;
			
			isToasterShow = editApi.status? true : false;
            if (apiResponse.status == 'success') {
				setTimeout(() => {
					goto('/professor/exams')
				},1000)
            }
		}
	});	
</script>

<main>
	{#if loading == false}
	<div class="mx-auto max-w-8xl px-2 sm:px-6 lg:px-0 bg-white mt-10">
		<!-- <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 ml-5">Professor Add new Exam</h1> -->
		{#if isToasterShow === true}
			<Toaster message="{apiResponse.message}" statusCode="{apiResponse.status}" class="w-full" position="top-right"></Toaster>
		{/if}
		
        <div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">
            <section class="bg-white dark:bg-gray-900">
                <div class="py-4 px-4 mx-auto max-w-2xl">
                    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit Exam</h2>
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
								<Input id="duration" name="duration" type="text" placeholder="Enter duration" on:change{handleChange} bind:value={$form.duration}/>
                                {#if $errors.duration}
						            <small class="text-red-600">{$errors.duration}</small>
					            {/if}
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
                                    <Select id="subject_id" name="subject_id" class="mt-2" placeholder="Choose Subject" on:change{handleChange} bind:value={$form.subject_id} disabled>
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
                            Edit Exam
                        </button> OR <a href="/professor/exams" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Cancel</a>
                    </form>
                </div>
              </section>
        </div>
			
	</div>
	{:else}
		<div class="">
			<Spinner color="purple" style="top: 50%;left: 50%;position: absolute;"/>
		</div>
	{/if}
</main>
