<script lang="ts">
	import { onMount } from 'svelte';
	import { professorExams } from '../../../../api/professor/exams';
	import { page } from '$app/stores';
	import Question from '../../../../api/Question.svelte';
	import { CheckCircleSolid, CloseCircleSolid, EditOutline, InfoCircleSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	
	import { Card } from 'flowbite-svelte';
	const { getResultFunc } = professorExams();

	let exam_id = $page.params.id;
	let currentQuestionIndex = 0;
	let selectedOption: any;
	let studentResult: any = [];
	$: studentResult, selectedOption;
	const getResult = async () => {
		let apiCall = await getResultFunc(exam_id);

		if (apiCall.status == 'success') {
			studentResult = apiCall.data;

			studentResult.questions.forEach((element: any,i) => {
				let selectedOptionIndex = element.option.findIndex((opt: any) =>  opt.id === element?.answer?.option_id?.id);
				if(selectedOptionIndex > -1) {
					element.index = selectedOptionIndex;
				}	
			})
		} else {
			console.log(apiCall.message);
		}
	};
	onMount(async () => {
		await getResult();
	});
</script>

<main>
	<div class="mx-auto max-w-8xl px-2 sm:px-6 lg:px-0 bg-white mt-10">
		<div class="flex items-center justify-between gap-x-6 p-4">
			<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 ml-5">Exams Result</h1>
		</div>
		<div class="py-4 px-4 mx-auto max-w-2xl">
			{#if studentResult}
			<Card size="xl">
				<h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Student: <span class="text-gray-500 font-normal">{studentResult.student}</span>
				</h3>
				<h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Exam: <span class="text-gray-500 font-normal">{studentResult.exam}</span>
				</h3>
				<h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Subject: <span class="text-gray-500 font-normal">{studentResult.subject}</span>
				</h3>
				<h2 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Exam Duration: {studentResult.exam_duration}
				</h2>
				<h2 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Total Questions: {studentResult.total_questions}
				</h2>
				<h2 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					You Spent: {studentResult.youSpent}
				</h2>
				<h2 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
					Result: {studentResult.result}
				</h2>
				<h2 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">Questions:</h2>

				{#if studentResult.questions && studentResult.questions.length > 0}
                    {#each studentResult.questions as question, i}
					<div class="question {i != 0 ? 'mt-2' : ''} mb-2">
                        <p class="font-medium text-black flex items-center gap-2 pb-2"> 
							{i+1 + ').'} {question.question}
							{#if !question.answer} 
								<InfoCircleSolid class="w-5 h-5 text-orange-700" title="Not Attempted" /> 
							{/if}
						</p>
						<div>
							{#each question.option as opt,index}
								<div class="flex items-center gap-2 py-2">
									<input disabled
									type="radio"
									class="shrink-0 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
									id="option.{opt.id}"
									value="{opt.id}"
									checked={question.answer && opt.id == question.answer.option_id.id ? 'checked' : ''}
									/>
									{opt.option}
									{#if index === question.index} 
										{#if opt.answer} 
											<CheckCircleSolid class="w-5 h-5 text-green-700" /> 
										{:else}
											<CloseCircleSolid class="w-5 h-5 text-red-700" />
										{/if}
									{/if}
									
									

									{#if index !== question.index && opt.answer}
										<CheckCircleSolid class="w-5 h-5 text-green-700" /> 
									{/if}				
								</div>
							{/each}
						</div>
                        {#if !question.answer}
                            <p class="text-orange-600 py-1">Not Attempted!</p>
                        {/if}
                        <!-- <p>Right answer: {(question.option.find((item) => item.answer)).option}</p> -->
                        <p class="font-medium text-black">Mark: {question.answer && (question.option.find((item) => item.id === question.answer.option_id.id)).answer ? 1 : 0}</p>
					</div>
                    {/each}
				{/if}
			</Card>
			{/if}
		</div>
	</div>
</main>
