<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Toggle,
		Alert,
		Spinner,
		Modal,
		Button
	} from 'flowbite-svelte';
	import { ExclamationCircleOutline, InfoCircleOutline, InfoCircleSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import { students } from '../../api/admin/students';
	let openRow:number | null;
	let searchTerm = '';
	let defaultModal: any = { open: false, userid: null};
  	let { getAllStudents, updateStatusUser, deleteUser } = students();
	let userList: any = [];
	$: userList;
	let loading: any = false;
	let updateStatusApiCall: any;
	let deleteUserApiCall: any;
	$: updateStatusApiCall;
	$: deleteUserApiCall;
	$: loading;

	async function getStudents() {
		let apiCall = await getAllStudents();
		if (apiCall.statusCode == "success") {
			userList = apiCall.data;
		} else {
			userList = []
		}
	}
	onMount(async () => {
		loading = true;
		await getStudents();
		loading = false;
	})
  
  	$: filteredItems = userList.filter((item: any) => {
		return (item.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
		(item.last_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
		(item.email.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
	});

	const toggleRow = (i: number) => {
		if(userList[i].type === 'thesis') {
			openRow = (openRow === i) ? null : i
		}
  	}
	let showAlert: any = false;
	$: showAlert;
	const updateStatus: any = async (userid: any) => {
		loading = true;
		showAlert = false;
		updateStatusApiCall = await updateStatusUser(userid);
		if(updateStatusApiCall.statusCode == 'success') {
			showAlert = true;
		}
		await getStudents();
		loading = false;
		setTimeout(() => {
			showAlert = false;
		}, 1000);
	}

	const deleteProfessor: any = async (userid: any) => {
		loading = true;
		showAlert = false;
		updateStatusApiCall = await deleteUser(userid);
		if(updateStatusApiCall.statusCode == 'success') {
			showAlert = true;
		}
		defaultModal.open = false;
		await getStudents();
		loading = false;
		setTimeout(() => {
			showAlert = false;
		}, 1000);
	}
</script>

<main class="container">
	{#if loading == false}
	<div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">
		<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 py-4">Students</h1>
			{#if showAlert}
				<Alert color="green" dismissable class="mb-1">
					<InfoCircleSolid slot="icon" class="w-4 h-4" />
					{updateStatusApiCall.message}
				</Alert>
			{/if}

		{#if userList.length > 0}
			<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
				{#if filteredItems.length > 0}
				<Table>
					<TableHead>
						<TableHeadCell>Name</TableHeadCell>
						<TableHeadCell>Email</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell class="sr-only">Action</TableHeadCell>
					</TableHead>
					<TableBody tableBodyClass="divide-y divide-gray-100">
						{#each filteredItems as item, i}
						<TableBodyRow on:click={() => toggleRow(i)}>
							<TableBodyCell>{item.first_name} {item.last_name}</TableBodyCell>
							<TableBodyCell>{item.email}</TableBodyCell>
							<TableBodyCell>
								<Toggle checked={item.status === 'active'} on:change={updateStatus(item.id)}></Toggle>
							</TableBodyCell>
							<TableBodyCell>
								<!-- <a href="/admin/students/{item.id}" class="font-medium text-primary-500 hover:underline dark:text-primary-400">Show</a>  -->
								<!-- <a href="/admin/professors/1/edit" class="font-medium text-gray-500 hover:underline dark:text-gray-400">Edit</a> -->
								<!-- <button on:click={() => (defaultModal = { open: true, userid: item.id })} class="font-medium text-red-600 hover:underline dark:text-red-500">Delete</button> -->
								<div class="flex items-center gap-2">
									<a href="/admin/students/{item.id}" class="font-medium text-primary-500 hover:underline dark:text-primary-400">
										<InfoCircleOutline class="w-5 h-5 text-black" />
									</a>									
									<button on:click={() => (defaultModal = { open: true, userid: item.id })} class="font-medium text-red-600 hover:underline dark:text-red-500"><TrashBinSolid class="w-5 h-5 text-red-600" /></button>
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
				<!-- <Modal title="Delete Student" bind:open={defaultModal.open} autoclose>
					<p class="text-base text-center leading-relaxed text-gray-500 dark:text-gray-400">Are you sure, you want to delete selected student.</p>
					<div class="d-flex justify-center bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 flex items-center p-6 space-x-2 rtl:space-x-reverse rounded-b-lg">
						<button type="button" class="text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 dark:text-gray-400 hover:text-primary-700 focus-within:text-primary-700 dark:focus-within:text-white dark:hover:text-white dark:bg-transparent dark:border-gray-600 dark:hover:border-gray-700 focus-within:ring-gray-200 dark:focus-within:ring-gray-700 rounded-lg">
							No
						</button>
						<button on:click={() => deleteProfessor(defaultModal.userid)} type="button" class="text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg">
							Yes
						</button>
					</div>
				</Modal> -->
				<Modal title="Delete Student" bind:open={defaultModal.open} size="xs" autoclose>
					<div class="text-center">
						<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">ArAre you sure, you want to delete selected student?</h3>
						<Button color="red" class="me-2" on:click={() => deleteProfessor(defaultModal.userid)}>Yes, I'm sure</Button>
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
