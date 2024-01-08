<script lang="ts">
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
    import { professorSubject } from '../../../api/professor/questions'
    import type { PageData } from './$types';
	import { createForm } from 'svelte-forms-lib';
	import { goto } from '$app/navigation';
    
    let apiResponse: any; 
	$: apiResponse = {
        status: 'error',message: ''
    };
    
    const { getUser, addQuestionToSubject } = professorSubject();
    
    import { Input, Label, Helper, Button, Checkbox, A, Textarea,Select,Datepicker, Toast } from 'flowbite-svelte';
	import Toaster from '../../../api/Toaster.svelte';
	let isToasterShow: any = false;
    $: isToasterShow;
    
    let message: any = '';
    
    export let data: PageData;
    let options = [
        { id: 1, option: '', answer: false, status: 'active' },
        { id: 2, option: '', answer: false, status: 'active' },
    ];
    
    const maxOptions = 8;

    function addOption() {
        let totalLength = options.length;
        if (totalLength < maxOptions) {
        const newOption = {
            id: options[totalLength - 1].id + 1,
            option: '',
            answer: false,
            status: 'active'
        };
        options = [...options, newOption];
        } else {
            // alert('You have reached the maximum limit of options (8).');
            apiResponse.message = 'You have reached the maximum limit of options (8).'
            isToasterShow = true;
        }
    }
    function removeOption(id: any) {
        if (options.length > 2) {
            options = options.filter((option,i) => i !== id);
        } else {
            // alert('You must have at least two option.');
            apiResponse.message = 'You must have at least two option.';
            isToasterShow = true;
        }
    }
    
    const { form, errors,handleSubmit,handleChange }: any= createForm({
		initialValues: {
			questions: '',
            options: [],
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
            
            options.forEach((option,i) => {
                if(option.option === '')  {
                    errs[`options.${i}`] = "This option is required";
                }           
                delete option.id;
            })
            
			return errs;
		},
		onSubmit: async (values) => {
            const selectAnswer:any = document.querySelector('input[name="option_values"]:checked')?.getAttribute('selected_value');
            
            options.forEach((option,i) => {
                if(i == selectAnswer) {
                    option.answer = true
                } else {
                    option.answer = false
                }
            })
            let user: any = await getUser();
            
			const payload: any = {
                question: values.questions,
                status: 'active',
                professor_id: user.id,
                subject_id: user.subject_id,
                option: options,
			}
            
			isToasterShow = false
            let createQuestionApi = await addQuestionToSubject(payload);
            apiResponse = createQuestionApi;
            
			
			isToasterShow = createQuestionApi.status ? true : false;
            if (apiResponse.status == 'success') {
				setTimeout(() => {
					goto('/professor/questions')
				},1000)
            }
            
        }
	});	
</script>

<div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">
    <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            {#if isToasterShow === true} 
			    <Toaster message="{apiResponse.message}" statusCode="{apiResponse.status}" class="w-full" position="top-right"></Toaster>
		    {/if}
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a New Question</h2>
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
                      
                        {#each options as option,i}
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
                                    
                                    {#if options.length > 2}
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
                    Add Question
                </button> or <a href="/professor/questions" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Cancel</a>
            </form>
        </div>
      </section>
</div>
