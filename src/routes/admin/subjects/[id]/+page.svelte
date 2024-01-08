<script lang="ts">
    import { onMount } from 'svelte';
    import { students } from '../../../api/admin/students';
    import { Input, Label, Helper, Button, Checkbox, A, Spinner } from 'flowbite-svelte';
    import { page } from '$app/stores';
	import { subjects } from '../../../api/admin/subjects';
    
    let { getOneSubject } = subjects();
    let subjectid = $page.params.id, loading: any = false;
    let subject: any = {};
    $: subject;
    const getIndividualSubject = async() => {         
      let apiCall = await getOneSubject(Number(subjectid));
      if(apiCall.status == 'success') {
        subject = apiCall.data[0];
      } else {
        subject = {};
      }
    }
    
    onMount(async () => {
      loading = true;
      await getIndividualSubject()
      loading = false;
    })
    </script>
    
    <header>
      <div class="mx-auto max-w-8xl px-4 sm:px-6 lg:px-2 lg:mt-2">
        <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Show Subjects</h1>
      </div>
    </header>
    <main>
    {#if loading == false}
        {#if subject != null}
          <div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <Label for="first_name" class="mb-2">Name</Label>
                <p class="capitalize">
                  {subject.name}
                </p>
              </div>
              <div>
                <Label for="last_name" class="mb-2">Description</Label>
                <p class="">
                  {subject.description}
                </p>
              </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
              <div class="mb-6">
                <Label for="email" class="mb-2">Professors</Label>
                <!-- {subject.professor} -->
                {#if subject.professor && subject.professor.length > 0}
                  {#each subject.professor as professor }
                    <p class="lowercase">{professor.first_name} {professor.last_name} - {professor.email}</p>
                    <!-- <br/> -->
                  {/each}
                {:else}
                  <p>No professor found.</p>  
                {/if}
              </div>
            </div>
          </div>
        {:else}
          <div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4">
            No data found
          </div>
        {/if}
    {:else}
      <div class="">
          <Spinner color="purple" style="top: 50%;left: 50%;position: absolute;"/>
        </div>
    {/if}
  </main>
