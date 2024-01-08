<script lang="ts">
	import { page } from '$app/stores';
	import Toaster from '../../../../api/Toaster.svelte';
    import { professorSubject } from '../../../../api/professor/questions'
	import { createForm } from 'svelte-forms-lib';
    import { onMount } from 'svelte';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { Spinner } from 'flowbite-svelte';

    let questionID = $page.params.id;

    const maxOptions = 8;

    let optionsList: any = [], questionData: any = [];
    
    const { getIndividualQuestionBySubject, getUser, editQuestion } = professorSubject();
    
    let isToasterShow: any,  apiResponse: any, loading: any = false;
    $: isToasterShow, optionsList, questionData;
	$: apiResponse = {};
    
    const getQuestionDetails = async() => {

      let apiCall = await getIndividualQuestionBySubject(questionID);

      if(apiCall.status == 'success') {
        questionData = apiCall.data[0];
        
        optionsList =  await questionData.options.map((option: any) => {
            option.status = 'active';
            return option;
        })
        $form.questions = questionData.question;
        $form.status = questionData.status;
      } else {
        console.log(apiCall.message);
      }
    }

    function addOption() {
        let totalLength = optionsList.length;
        if (totalLength < maxOptions) {
            const newOption = {
                id: optionsList[totalLength - 1].id + 1,
                option: '',
                answer: false,
                status: 'active'
            };
            optionsList = [...optionsList, newOption];
        } else {
            apiResponse.message = 'You have reached the maximum limit of options (8).'
            isToasterShow = true;
        }
    }

    function removeOption(id: any) {
        if (optionsList.length > 2) {
            optionsList = optionsList.filter((option,i) => i !== id);
        } else {
            apiResponse.message = 'You must have at least two option.';
            isToasterShow = true;
        }
    }

    const { form, errors, handleSubmit, handleChange }: any= createForm({
		initialValues: {
			questions: '',
            options: [],
            status: ''
		},
		validate: values => {
			let errs: any = {};

            if(values.questions === '') {
                errs.questions = "Please enter question";
            }

            if (values.options) {
                values.options.forEach((option, index) => {
                    if (!option.option) {
                        errs[`options.${index}`] = "This option is required";
                    }
                });
            }

            optionsList.forEach((option,i) => {
                if(option.option === '')  {
                    errs[`options.${i}`] = "This option is required";
                }           
                delete option.id;
            })

			return errs;
		},
		onSubmit: async (values: any) => {
            const selectAnswer:any = document.querySelector('input[name="option_values"]:checked').getAttribute('selected_value');

            optionsList.forEach((option,i) => {
                if(i == selectAnswer) {
                    option.answer = true
                } else {
                    option.answer = false
                }
            })

			const payload: any = {
                question: values.questions,
                status: values.status,
                option: optionsList,
			};

			isToasterShow = false
            let editQuestionApi = await editQuestion(questionID, payload);

            apiResponse = editQuestionApi;
			
			isToasterShow = editQuestionApi.status ? true : false;
            if (apiResponse.status == 'success') {
				setTimeout(() => {
					goto('/professor/questions');
				},1000);
            }
        }
	});	
    
    onMount(async() => {
        loading = true;
        await getQuestionDetails()
        loading = false;        
    });
</script>
<main>
	{#if loading == false}
	<div class="mx-auto max-w-8xl px-2 sm:px-6 lg:px-0 bg-white mt-10">
        {#if isToasterShow === true}
			<Toaster message="{apiResponse.message}" statusCode="{apiResponse.status}" class="w-full" position="top-right"></Toaster>
		{/if}
        <div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">
            <section class="bg-white dark:bg-gray-900">
                <div class="py-4 px-4 mx-auto max-w-2xl">
                    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit Question</h2>
                    <form method="post" on:submit|preventDefault={handleSubmit}>
                        <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div class="sm:col-span-2">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                <textarea id="questions" name="questions" rows="2" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Question" on:change={handleChange} bind:value={$form.questions}></textarea>
                                {#if $errors.questions}
                                    <small class="text-red-600">{$errors.questions}</small>
                                {/if}
                            </div>
        
                            <div class="sm:col-span-2">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Options</label>
                              
                                {#each optionsList as option,i}
                                    <div>
                                        <div class="flex rounded-lg">
                                            <span class="px-4 inline-flex items-center min-w-fit text-sm text-gray-500 dark:text-gray-400">
                                              <span class="flex">
                                                <input type="radio" class="shrink-0 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-input-group-with-radio.{i}" name="option_values" selected_value={i} checked="{option.answer == true ? 'checked' : ''}" required >
                                                <label for="hs-input-group-with-radio.{i}" class="sr-only">Radio</label>
                                              </span>
                                            </span>
                                            <input
                                                type="text"
                                                bind:value={option.option}
                                                name="options.{i}"
                                                id="name_{option.id}"
                                                class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Type question title"
                                            />
                                            {#if $errors[`options.${i}`]}
                                                <small class="text-red-600">{$errors[`options.${i}`]}</small>
                                            {/if}
                                            
                                            {#if optionsList.length > 2}
                                                <button type="button" on:click={() => removeOption(i)} class="flex items-center justify-between w-1/5	"><CloseCircleSolid class="w-6 h-6 text-orange-600" /></button>
                                            {/if}
                                        </div>
                                    </div>
                                    <!-- <button on:click={() => removeOption(option.id)}>Remove</button> -->
                                {/each}
                              
                                <button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer" on:click={addOption}>+ Add more options</button>
                              </div>
                        </div>
                        <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Edit Question
                        </button> or <a href="/professor/questions" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Cancel</a>
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
