<script lang="ts">
	import { createForm } from 'svelte-forms-lib';
	import { subjects } from '../../../../api/admin/subjects';
    import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Toaster from '../../../../api/Toaster.svelte';
	import { Spinner } from 'flowbite-svelte';
    let { updateSubject, getOneSubject } = subjects();
    $: isToasterShow = false;
    let apiResponse: any; 
	$: apiResponse = {};
    let subjectid: any = $page.params.id, loading: any = false;
    let subject: any = {};
    $: subject;
    const getIndividualSubject = async() => {         
      let apiCall = await getOneSubject(Number(subjectid));
      if(apiCall.status == 'success') {
        subject = apiCall.data[0];
        $form.name = subject.name
        $form.description = subject.description
      } else {
        subject = {};
      }
    }
    
    onMount(async () => {
        loading = true;
        await getIndividualSubject()
        loading = false;
    });
    
    const { form, errors, handleSubmit, handleChange }: any= createForm({
		initialValues: {
            name: '',
            description: ''
        },
		validate: values => {           
			let errs: any = {};
			if(values.name === "") {
				errs.name = "Subject name is required.";
			}

			if(values.description === "") {
				errs.description = "Subject description is required";
			}
			return errs;
		},
		onSubmit: async (values) => {
            isToasterShow = false
            let updateApi = await updateSubject(subjectid, values);
            apiResponse = updateApi;
			isToasterShow = updateApi.status ? true : false;
            if (apiResponse.status == 'success') {
                setTimeout(() => {
                    goto('/admin/subjects')
                }, 2000);
            }
		}
	});
    
</script>

<div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4">
    {#if loading == false}
    <section class="bg-white dark:bg-gray-900">
        {#if isToasterShow === true}
            <Toaster message="{apiResponse.message}" statusCode="{apiResponse.status}"></Toaster>
        {/if}
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit subject</h2>
            <form method="post" on:submit|preventDefault={handleSubmit}>
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div class="sm:col-span-2">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type subject name" on:change={handleChange} bind:value={$form.name} >
                        {#if $errors.name}
                            <small class="text-red-600">{$errors.name}</small>
                        {/if}
                    </div>

                    <div class="sm:col-span-2">
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea id="description" rows="8" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Subject description here" on:change={handleChange} bind:value={$form.description}></textarea>
                        {#if $errors.description}
                            <small class="text-red-600">{$errors.description}</small>
                        {/if}
                    </div>
                </div>
                <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Save
                </button> or <a href="/admin/subjects" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Cancel</a>
            </form>
        </div>
    </section>
    {:else}
      <div class="">
          <Spinner color="purple" style="top: 50%;left: 50%;position: absolute;"/>
        </div>
    {/if}
</div>
