<script lang="ts">
	import { page } from '$app/stores';
	import { Card, Button, Modal } from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { professorExams } from '../../../api/professor/exams';
	import Question from '../../../api/Question.svelte';
	import { goto } from '$app/navigation';
    import Toaster from '../../../api/Toaster.svelte';
	import { PaginationItem } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';


	let defaultModal: any = { open: false};
	let isToasterShow: any = false;
    $: isToasterShow;
	let exam_id = $page.params.id;
	let questionDetails: any = [];
	$: questionDetails;
	const { joinExamFunc, saveExamFunc, checkExamFunc } = professorExams();
	let currentQuestionIndex = 0;
	let intervalId: any = null;
	let selectedOption: any = null;
    let apiResponse: any; 
	$: apiResponse = {
        status: 'error',message: ''
    };
	const joinExam = async () => {
		let apiCall = await joinExamFunc(exam_id);

		if (apiCall.status == 'success') {
			questionDetails = apiCall.data[0];
		} else {
			console.log(apiCall.message);
		}
	};

	const checkExam = async () => {
		let apiCall = await checkExamFunc(exam_id);

		if (apiCall.status == 'success') {
			// console.log(apiCall.message);
		} else {
			goto(`/student/exams/${exam_id}/result`);
			// console.log(apiCall.message);
		}
	};
    const saveExam = async () => {
        isToasterShow = false
		let apiCall = await saveExamFunc(exam_id);
        apiResponse = apiCall;
		
		isToasterShow = apiResponse.status ? true : false;
		if (apiCall.status == 'success') {
            console.log(apiCall.message);
            setTimeout(() => {
                goto('/student/exams');
            },1000)
			// questionDetails = apiCall.data[0];
		} else {
			console.log(apiCall.message);
		}
	};

	onMount(async (): () => void => {
		await joinExam();
		await checkExam();
		intervalId = setInterval(async () => {
			await checkExam(); // Fetch data every 5 seconds
		}, 5000);

		// // Cleanup function
		// const cleanup = () => {
		// 	clearInterval(intervalId);
		// };

		// return cleanup; // Return the cleanup function
	});
	// return await cleanup(); // Return the cleanup function	
	async function goToNextQuestion() {
		await joinExam();

		if (currentQuestionIndex < questionDetails.questions.length - 1) {
			currentQuestionIndex += 1;
            selectedOption = questionDetails.questions[currentQuestionIndex].answer?.option_id;
		}
	}

	async function goToPreviousQuestion() {
		await joinExam();

		if (currentQuestionIndex > 0) {
			currentQuestionIndex -= 1;
            selectedOption = questionDetails.questions[currentQuestionIndex].answer?.option_id;
		}
	}

	onDestroy(() => {
		clearInterval(intervalId);
	});
async function handleSave() {
    await saveExam();
}


</script>

<main>
    <div class="mx-auto max-w-8xl px-2 sm:px-6 lg:px-0 bg-white mt-10">
		<div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
			{#if isToasterShow === true} 
				<Toaster message="{apiResponse.message}" statusCode="{apiResponse.status}" class="w-full" position="top-right"></Toaster>
			{/if}
            <!-- <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 ml-5">
				Exam Name: {questionDetails.exam}
			</h1> -->
			<Card size="xl">
				<h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Exam Name: {questionDetails.exam}
				</h3>
				<h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Subject: <span class="text-gray-500 font-normal">{questionDetails.subject}</span>
				</h3>
				<h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Creator: <span class="text-gray-500 font-normal">{questionDetails.professor}</span>
				</h3>
				{#if questionDetails.questions && questionDetails.questions.length > 0}
					{#each questionDetails.questions as question, i}
						{#if currentQuestionIndex === i}
							<Question question={question} question_number={currentQuestionIndex+1} />
						{/if}
					{/each}

					<div class="flex space-x-3 rtl:space-x-reverse mt-4">
						<PaginationItem class="{currentQuestionIndex === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}" on:click={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
							Previous
						</PaginationItem>
						<PaginationItem
						class="{currentQuestionIndex === questionDetails.questions.length - 1 ? 'cursor-not-allowed' : 'cursor-pointer'}"
						on:click={goToNextQuestion}
						disabled={currentQuestionIndex === questionDetails.questions.length - 1}>
							Next
						</PaginationItem>
					</div>
				{:else}
					<p>No questions available</p>
				{/if}

                {#if questionDetails.questions && currentQuestionIndex === questionDetails.questions.length - 1}
					<div class="py-8 max-w-2xl ">
						<Button on:click={() => defaultModal.open = true} type="submit" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800" size="xl">
							Save
						</Button>
					</div>
            	{/if}
			</Card>
			<Modal title="Confirm Save Exam" bind:open={defaultModal.open} size="xs" autoclose>
				<div class="text-center">
					<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure, you want to submit Exam?</h3>
					<Button color="red" class="me-2" on:click={handleSave}>Yes, I'm sure</Button>
					<Button color="alternative">No, Cancel</Button>
				</div>
			</Modal>
		</div>
	</div>
</main>
