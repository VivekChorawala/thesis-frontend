<script lang="ts">
	import type { PageData } from './$types';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		TableSearch,
		Modal,
		Toggle,
		Spinner
	} from 'flowbite-svelte';
	import { professorSubject } from '../../api/professor/questions';
	import { ExclamationCircleOutline, TrashBinSolid, EditOutline, InfoCircleOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import Toaster from '../../api/Toaster.svelte';
	import { goto } from '$app/navigation';

	let { getAllQuestionBySubjectAndProfessor, deleteQuestion, updateQuestionStatus, getUser } = professorSubject();
    let defaultModal: any = { open: false, questionID: null};
    let loading: any = false, showAlert: any = false;
	$: showAlert;
	let isToasterShow: any, deleteQuestionApiCall: any, apiResponse: any, user: any;
	$: isToasterShow, user;
	$: deleteQuestionApiCall;
	$: apiResponse = {};
	
  
  	let questionList: any = [];
	$: questionList;
    let searchTerm = '';
	
	
	const getQuestionByProfessor = async() => {
      
      let apiCall = await getAllQuestionBySubjectAndProfessor();
      
      if(apiCall.status == 'success') {
        questionList = apiCall.data;  
		filteredItems = questionList; 
      } else {
        console.log(apiCall.message);
		// let role = user.role;
        // localStorage.removeItem('user');
        // goto(`/signin/${role}`);
      }
    }

	const updateStatus: any = async (questionID: any) => {
		loading = true;
		showAlert = false;
		deleteQuestionApiCall = await updateQuestionStatus(questionID);

		apiResponse = deleteQuestionApiCall;
		isToasterShow = deleteQuestionApiCall.status ? true : false;
		setTimeout(async() => {
			isToasterShow = await false;
	  	},1000)
		await getQuestionByProfessor();
		loading = false;
	}
	
	export let data: PageData;
	
	onMount(async () => {
		loading = true;
		user = getUser();
        await getQuestionByProfessor()
		loading = false;
	})
	
	$: filteredItems = questionList.filter((item: any) => {
        return (item.question.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
        (item.subject_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
        (item.status.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
    });
	
	const deleteQuestions: any = async (questionID: any) => {
      loading = true;
      showAlert = false;
      
      deleteQuestionApiCall = await deleteQuestion(questionID);
      if(deleteQuestionApiCall.status == 'success') {
        showAlert = true;
      }
	  apiResponse = deleteQuestionApiCall
	  isToasterShow = deleteQuestionApiCall.status ? true : false;
	  ;
      defaultModal.open = false;
	  setTimeout(async() => {
		isToasterShow = await false;
	  },1000)
      await getQuestionByProfessor();
      loading = false;
  	}
</script>

<main>
	{#if loading == false}
	<div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">		
		<div class="flex items-center justify-between gap-x-6 p-4">
			<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Questions</h1>
			<Button color="blue" size="md" href="/professor/questions/new">Add Question</Button>
		</div>

		{#if isToasterShow === true}
			<Toaster message="{apiResponse.message}" statusCode="{apiResponse.status}" class="w-full" position="top-right"></Toaster>
		{/if}

		{#if questionList.length > 0}
		<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
			{#if filteredItems.length > 0}
				<Table>
					<TableHead>
						<TableHeadCell>Question</TableHeadCell>
						<TableHeadCell>Subject</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell>Action</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y divide-gray-100">
						{#each filteredItems as item, i}
						<TableBodyRow>
							<TableBodyCell>{item.question}</TableBodyCell>
							<TableBodyCell>{item.subject_name}</TableBodyCell>
							<TableBodyCell>
								<Toggle checked={item.status === 'active'} on:change={updateStatus(item.id)}></Toggle>
							</TableBodyCell>
							<TableBodyCell>
								<div class="flex items-center gap-2">
									<a href="/professor/questions/show/{item.id}" class="font-medium text-primary-500 hover:underline dark:text-primary-400">
										<InfoCircleOutline class="w-5 h-5 text-black" />
									</a>
									<a href="/professor/questions/edit/{item.id}" class="font-medium text-primary-500 hover:underline dark:text-gray-400">
										<EditOutline class="w-5 h-5 text-primary-500" />
									</a>
									<!-- <a href="javascript:;" class="font-medium text-red-600 hover:underline dark:text-red-500">Delete</a> -->
									<button on:click={() => (defaultModal = { open: true, questionID: item.id })} class="font-medium text-red-600 hover:underline dark:text-red-500"><TrashBinSolid class="w-5 h-5 text-red-600" /></button> 
								</div>
							</TableBodyCell>
						</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
				{:else}
					<div class="h-32 flex items-center justify-center">No data found</div>
				{/if}
		</TableSearch>
		{:else}
			<div class="h-32 flex items-center justify-center">No data found</div>
		{/if}
		<Modal title="Delete Question" bind:open={defaultModal.open} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this Question?</h3>
				<Button color="red" class="me-2" on:click={() => deleteQuestions(defaultModal.questionID)}>Yes, I'm sure</Button>
				<Button color="alternative">No, Cancel</Button>
			</div>
		</Modal>
	</div>
	{:else}
		<div class="">
			<Spinner color="purple" style="top: 50%;left: 50%;position: absolute;"/>
		</div>
	{/if}
</main>
