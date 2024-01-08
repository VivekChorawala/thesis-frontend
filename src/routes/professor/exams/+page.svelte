<script lang="ts">
	import { onMount } from 'svelte';
	import { professorExams } from '../../api/professor/exams';
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Modal,
		Alert,
		Dropdown,
		Radio,
		Spinner
	} from 'flowbite-svelte';
	import { page } from '$app/stores';
	import moment from 'moment';
	import {
		ExclamationCircleOutline,
		InfoCircleSolid,
		TrashBinSolid,
		EditOutline,
		ChevronDownSolid
	} from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	  
    let defaultModal: any = { open: false, examID: null};
    let changeStatusModal: any = { open: false, examID: null};
    let examList: any = [];
    let searchTerm = '', status = [], user: any;
	  $: examList, user;
    let showAlert: any = false, loading: any = false;
	  $: showAlert;
    let updateStatusApiCall: any;
	  $: updateStatusApiCall;
    
    
    
    let { getAllExams, deleteExam, updateExamStatus, getUser } = professorExams();
    const getExamsByProfessor = async() => {
      
      let apiCall = await getAllExams();
      
      if(apiCall.status == 'success') {
        filteredItems = await apiCall.data;  
        examList = apiCall.data;  
        status = filteredItems.map((exam: any) => {
          return { id: exam.id, status: exam.status}
        });
      } else {
        console.log(apiCall.message);
        // let role = user.role;
        // console.log("user",user);
        
        // localStorage.removeItem('user');
        // goto(`/signin/${role}`);
      }
    }
    
    const handleChange = (e: any) => {
      e.preventDefault();
      let examID = e.srcElement.getAttribute('exam_id');
      
      changeStatusModal = { open: true, examID: examID }
    };
    
    
    onMount(async () => {
      loading = true;
      user = getUser();
      await getExamsByProfessor()
      loading = false;      
    })
    $: filteredItems = examList.filter((item: any) => {
        return (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
        (item.subject_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
        (item.category.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
        (item.status.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
    });
    
    const deleteExams: any = async (examID: any) => {
      loading = true;
      showAlert = false;
      
      updateStatusApiCall = await deleteExam(examID);
      showAlert = updateStatusApiCall.status ? true : false;      
      defaultModal.open = false;
	  setTimeout(async() => {
		showAlert = await false;
	  },1000)
      await getExamsByProfessor();
      loading = false;
  	}
    
    const changeExamStatus: any = async (examID: any) => {
      loading = true;
      showAlert = false;
      
      updateStatusApiCall = await updateExamStatus(+examID);
      
      showAlert = updateStatusApiCall.status ? true : false;
      changeStatusModal.open = false;
	  setTimeout(async() => {
		showAlert = await false;
	  },1000)
      await getExamsByProfessor();
      loading = false;
  	}
    </script>

<main>
	{#if loading == false}
		<div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">
			<div class="flex items-center justify-between gap-x-6 py-4">
				<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
					Professor Exams
				</h1>
				<Button color="blue" size="md" href="/professor/exams/new">Add Exam</Button>
			</div>
			{#if showAlert}
				<div>
					<Alert color="green" dismissable class="mb-1">
						<InfoCircleSolid slot="icon" class="w-4 h-4" />
						{updateStatusApiCall.message}
					</Alert>
				</div>
			{/if}
			<!-- Your content -->
			{#if examList.length > 0}
			<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
				{#if filteredItems.length > 0}
					<Table divClass="overflow-visible">
						<TableHead>
							<TableHeadCell>Exam Code</TableHeadCell>
							<TableHeadCell>Exam name</TableHeadCell>
							<TableHeadCell>Subject name</TableHeadCell>
							<TableHeadCell>Category</TableHeadCell>
							<!-- <TableHeadCell>Start Time</TableHeadCell>
							<TableHeadCell>End Time</TableHeadCell> -->
							<TableHeadCell>Duration</TableHeadCell>
							<TableHeadCell>Total Questions</TableHeadCell>
							<TableHeadCell>Status</TableHeadCell>
							<TableHeadCell>Action</TableHeadCell>
						</TableHead>
						<TableBody class="divide-y">
							{#each filteredItems as item, i}
								<TableBodyRow>
									<TableBodyCell>{item.code}</TableBodyCell>
									<TableBodyCell>{item.name}</TableBodyCell>
									<TableBodyCell>{item.subject_name}</TableBodyCell>
									<TableBodyCell>{item.category}</TableBodyCell>
									<!-- <TableBodyCell
										>{moment(item.started_at).format('YYYY-MM-DD HH:mm:ss A')}</TableBodyCell
									>
									<TableBodyCell
										>{moment(item.finished_at).format('YYYY-MM-DD HH:mm:ss A')}</TableBodyCell
									> -->
									<TableBodyCell>{item.duration}</TableBodyCell>
									<TableBodyCell>{item.total_questions}</TableBodyCell>
									<TableBodyCell>
										{#if item.status != 'finished'}
											<Button>
												{item.status == 'started' ? 'Started' : ''}
												{item.status == 'not_started' ? 'Not Started' : ''}
												<ChevronDownSolid class="w-3 h-3 ms-2 text-white dark:text-white" /></Button
											>
											<Dropdown class="w-48 p-3 space-y-1">
												<li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
													<Radio
														name="group-{i}"
														bind:group={status[i].status}
														value="not_started"
														exam_id={item.id}
														on:change={handleChange}>Not Started</Radio
													>
												</li>
												<li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
													<Radio
														name="group-{i}"
														bind:group={status[i].status}
														value="started"
														on:change={handleChange}
														exam_id={item.id}>Started</Radio
													>
												</li>
											</Dropdown>
										{/if}
										{item.status == 'finished' ? 'Finished' : ''}
									</TableBodyCell>
									<TableBodyCell>
										<div class="flex items-center gap-2">
											{#if item.status == 'not_started'}
												<a
													href="/professor/exams/edit/{item.id}"
													class="font-medium text-primary-500 hover:underline dark:text-primary-400"
												>
													<EditOutline class="w-5 h-5 text-black" />
												</a>
											{/if}
											<!-- <button class="font-medium text-red-600 hover:underline dark:text-red-500">Delete</button> -->
											<button
												on:click={() => (defaultModal = { open: true, examID: item.id })}
												class="font-medium text-red-600 hover:underline dark:text-red-500"
											>
												<TrashBinSolid class="w-5 h-5 text-red-600" />
											</button>
										</div>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
							<!-- {:else}
                <TableBodyRow>
                    <TableBodyCell colspan="4" tdClass="text-center h-200">
                        No Exams Found
                    </TableBodyCell>
                </TableBodyRow>
            {/if} -->
						</TableBody>
					</Table>
					{:else}
						<div class="h-32 flex items-center justify-center">No data found</div>
				{/if}
			</TableSearch>
			{:else}
				<div class="h-32 flex items-center justify-center">No data found</div>
			{/if}
			<!-- <Modal title="Delete Exam" bind:open={defaultModal.open} autoclose>
          <p class="text-base text-center leading-relaxed text-gray-500 dark:text-gray-400">Are you sure, you want to delete selected Exam.</p>
          <div class="d-flex justify-center bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 flex items-center p-6 space-x-2 rtl:space-x-reverse rounded-b-lg">
            <button type="button" class="text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 dark:text-gray-400 hover:text-primary-700 focus-within:text-primary-700 dark:focus-within:text-white dark:hover:text-white dark:bg-transparent dark:border-gray-600 dark:hover:border-gray-700 focus-within:ring-gray-200 dark:focus-within:ring-gray-700 rounded-lg">
              No
            </button>
            <button on:click={() => deleteExams(defaultModal.examID)} type="button" class="text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg">
              Yes
            </button>
          </div>
        </Modal> -->
			<Modal title="Delete Exam" bind:open={defaultModal.open} size="xs" autoclose>
				<div class="text-center">
					<ExclamationCircleOutline
						class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
					/>
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						Are you sure you want to delete this Exam?
					</h3>
					<Button color="red" class="me-2" on:click={() => deleteExams(defaultModal.examID)}
						>Yes, I'm sure</Button
					>
					<Button color="alternative">No, Cancel</Button>
				</div>
			</Modal>

			<Modal title="Change Status" bind:open={changeStatusModal.open} size="xs" autoclose>
				<div class="text-center">
					<ExclamationCircleOutline
						class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
					/>
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						Are you sure you want to change status of this Exam?
					</h3>
					<Button
						color="red"
						class="me-2"
						on:click={() => changeExamStatus(changeStatusModal.examID)}>Yes, I'm sure</Button
					>
					<Button color="alternative">No, Cancel</Button>
				</div>
			</Modal>
		</div>
	{:else}
		<div class="">
			<Spinner color="purple" style="top: 50%;left: 50%;position: absolute;" />
		</div>
	{/if}
</main>
