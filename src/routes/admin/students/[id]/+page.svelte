<script lang="ts">
  import { onMount } from 'svelte';
  import { students } from '../../../api/admin/students';
  import { Input, Label, Helper, Button, Checkbox, A, Spinner } from 'flowbite-svelte';
  import { page } from '$app/stores';
  
  let { getOneStudent } = students();
  let userid = $page.params.id;
  let user: any = {}, loading: any = false;
  $: user;
  const getIndividualUser = async() => {   
    let apiCall = await getOneStudent(Number(userid));
    if(apiCall.statusCode == 'success') {
      user = apiCall.data[0];
    } else {
      user = {};
    }
  }
  
  onMount(async () => {
    loading = true;
    await getIndividualUser()
    loading = false;
  })
  </script>

  <header>
    <div class="mx-auto max-w-8xl px-4 sm:px-6 lg:px-2 lg:mt-2">
      <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Show Student</h1>
    </div>
  </header>
  <main>
    {#if loading == false}
      {#if user != null}
        <div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4">
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label for="first_name" class="mb-2">First name</Label>
              <p class="capitalize">
                {user.first_name}
              </p>
            </div>
            <div>
              <Label for="last_name" class="mb-2">Last Name</Label>
              <p class="capitalize">
                {user.last_name}
              </p>
            </div>
          </div>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div class="mb-6">
              <Label for="email" class="mb-2">Email</Label>
              <p class="lowercase">{user.email}</p>
            </div>
            <div class="mb-6">
              <Label for="password" class="mb-2">Status</Label>
              <p class="capitalize">{user.status}</p>
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
