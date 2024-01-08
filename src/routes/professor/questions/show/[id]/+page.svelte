<script lang="ts">
	import { page } from '$app/stores';
	import { Card, Spinner } from 'flowbite-svelte';
    // import { professorExams } from '../../../../api/professor/exams';
    import { professorSubject } from '../../../../api/professor/questions';
    import { onMount } from 'svelte';    
    
    let question_id = $page.params.id;
    let questionDetails: any = [], loading: any = false;
	$: questionDetails;
	const { getIndividualQuestionBySubject } = professorSubject();
    
    
    const getQuestionDetails = async() => {
        let apiCall = await getIndividualQuestionBySubject(question_id);
      
        if(apiCall.status == 'success') {
            questionDetails = apiCall.data[0];
        } else {
            console.log(apiCall.message);
        }
    }
    
    onMount(async () => {
		loading = true;
        await getQuestionDetails();
		loading = false;
    })    
</script>


<main>
	{#if loading == false}
	<div class="mx-auto max-w-8xl px-2 sm:px-6 lg:px-0 bg-white mt-10">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 ml-5">Question Details</h1>
            <Card size="xl">
                <h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">Subject: <span class="text-gray-500 font-normal">{questionDetails.subject_name}</span></h3>
                <h3 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">Question: <span class="text-gray-500 font-normal">{questionDetails.question}</span></h3>
                <h2 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">Options:</h2>
                {#if questionDetails?.options?.length > 0}
                    <ol class="ml-10 text-black" style="list-style-type:upper-alpha">
                        {#each questionDetails.options as item, i}
                            <!-- {item} -->
                            <li>{item.option}
                                {#if item.answer === true}
                                    <span class="text-gray-500">(Answer)</span>
                                {/if}
                            </li> 
                        {/each}
                    </ol>
                {/if}
            </Card>
        </div>
    </div>
    {:else}
		<div class="">
			<Spinner color="purple" style="top: 50%;left: 50%;position: absolute;"/>
		</div>
	{/if}
</main>
