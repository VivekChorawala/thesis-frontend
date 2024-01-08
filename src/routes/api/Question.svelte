<!-- Question.svelte -->
<script lang="ts">
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import { professorExams } from './professor/exams';
	import { page } from '$app/stores';

	export let question: any, question_number: any;
	let selectedOption: any = null;
	// let questionDetails: any = [];
	// $: questionDetails;
	$: selectedOption;
    let exam_id = $page.params.id;
	const { captureAnswerFunc } = professorExams();
	// Handle user selection (if needed)
	const captureAnswer = async (qId: any, opId: any) => {
		let apiCall = await captureAnswerFunc(qId, opId, exam_id);

		if (apiCall.status == 'success') {
			console.log('success');
		} else {
			console.log(apiCall.message);
		}
	};
	async function handleOptionSelect(event: any) {
		selectedOption = event.target.value;
		await captureAnswer(selectedOption, question.id);
	}
	onMount(() => {
		if(question.answer != null) {
			selectedOption = question.answer.option_id;
		}
	});
</script>

<div class="question mt-3">
	<h3 class="pb-2">
		<strong class="text-black">Question {question_number}:</strong>
		{question.question}
	</h3>
	<div>
		{#each question.option as option, i}
			<div class="py-2">
				<input
					type="radio"
					class="shrink-0 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
					id="option{option.id}"
					name="option{question.id}"
                    value="{option.id}"
					on:change={handleOptionSelect}
					bind:group="{selectedOption}"
                    />
				{option.option}
			</div>
		{/each}
	</div>
</div>
