<script lang="ts">
	import { onMount } from 'svelte';
	import { professorExams } from '../../api/professor/exams';
	import {
		Input,
		Label,
		Helper,
		Button,
		Checkbox,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Modal,
		Alert
	} from 'flowbite-svelte';
	import moment from 'moment';
	import {
		ExclamationCircleOutline,
		InfoCircleSolid,
		TrashBinSolid,
		EditOutline,
		InfoCircleOutline
	} from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import Toaster from '../../api/Toaster.svelte';

	let defaultModal: any = { open: false, examID: null };
	let examList: any = [];
	let searchTerm = '';
	$: examList;
	let showAlert: any = false;
	$: showAlert;
	let loading: any = false;
	let updateStatusApiCall: any;
	$: updateStatusApiCall;
	let user: any;
	let inputValue = '';
	let apiResponse: any; 
	$: apiResponse = {};
    let isToasterShow: any;
    $: isToasterShow;
	const handleInput = (event: any) => {
		const value = event.target.value;
		// Allow only digits and limit the length to 6
		inputValue = value.replace(/\D/g, '').substring(0, 6);
	};
	let { getExamsForStudent, deleteExam, checkExamCodeFunc } = professorExams();
	const getExamsByStudent = async () => {
		let apiCall = await getExamsForStudent();

		if (apiCall.status == 'success') {
			examList = apiCall.data;
		} else {
			console.log(apiCall.message);
		}
	};

	onMount(async () => {
		user = JSON.parse(JSON.stringify(localStorage.getItem('user')));
		await getExamsByStudent();
	});
	$: filteredItems = examList.filter((item: any) => {
		return (
			item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
			item.subject_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
			item.category.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
			item.status.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
		);
	});
	let showError: any = false;
	$: showError;
	const joinExam = async (exam_id: any) => {
		if (inputValue.trim() !== "") {
			showError = false;
			let apiCall = await checkExamCodeFunc(exam_id, inputValue);
			apiResponse = apiCall;

			isToasterShow = apiCall.status ? true : false;
			inputValue = '';
			if (apiCall.status == 'success') {
				setTimeout(() => {
					goto(`/student/exams/${exam_id}`);
				}, 500);
			} else {
				// console.log(apiCall.message);
				await getExamsByStudent();
			}
			defaultModal.open = false;
		} else {
			showError = true;
		}
	};

	function getMinutesDifference(date: Date, duration: any) {
		let minutes: any;
		if(date != null){
			const diffInMilliseconds = Math.abs(new Date().getTime() - new Date(date).getTime());
			minutes = Math.floor(diffInMilliseconds / (1000 * 60)); // 1 minute = 60 seconds * 1000 milliseconds
		}
		return minutes >= duration;
	}
</script>

<main>
	<div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">
		{#if isToasterShow === true}
            <Toaster message="{apiResponse.message}" statusCode="{apiResponse.status}"></Toaster>
		{/if}
		<div class="flex items-center justify-between gap-x-6 p-4">
			<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 ml-5">Exams</h1>
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
	{#if examList.length > 0 }
		<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
			{#if filteredItems.length > 0}
			<Table>
				<TableHead>
					<!-- <TableHeadCell>Exam ID</TableHeadCell> -->
					<TableHeadCell>Subject</TableHeadCell>
					<TableHeadCell>Exam name</TableHeadCell>
					<TableHeadCell>Category</TableHeadCell>
					<!-- <TableHeadCell>Start Time</TableHeadCell>
					<TableHeadCell>End Time</TableHeadCell> -->
					<TableHeadCell>Duration</TableHeadCell>
					<TableHeadCell>Total Questions</TableHeadCell>
					<!-- <TableHeadCell>Status</TableHeadCell> -->
					<TableHeadCell>Action</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
						{#each filteredItems as item, i}
							<TableBodyRow>
								<!-- <TableBodyCell>{item.id}</TableBodyCell> -->
								<TableBodyCell>{item.subject_name}</TableBodyCell>
								<TableBodyCell>{item.name}</TableBodyCell>
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
									<div class="flex items-center">
										<!--  && !item.completed_at -->
										<!-- {item.duration}
										{item.duration}
										{getMinutesDifference(item.started_at, item.duration)} -->
										<!-- Exam ID: {item.id} -->
										<!-- {item.status == 'started' !getMinutesDifference(item.started_at, item.duration) && && item.studentDuration != '' && item.studentDuration != null ? 'join' : 'result' } -->
										{#if item.status == 'started' && !getMinutesDifference(item.started_at, item.duration) && (item.studentDuration == '' || item.studentDuration == null) }
											<!-- href="/student/exams/{item.id}" -->
											<Button color="red" size="xs" class="me-2" on:click={() =>	(defaultModal = { open: true, examID: item.id})}>Start Exam</Button>
											<!-- <a href="javascript:void(0)"
												on:click={() =>	(defaultModal = { open: true, examID: item.id})}
												class="font-medium text-primary-500 hover:underline dark:text-primary-400">
												Join
											</a> -->
										{:else}
											{#if item.started_at != "" && item.studentDuration != '' }
												<a href="/student/exams/{item.id}/result" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
													Result
												</a>
											{:else if item.started_at != "" && item.studentDuration == ''}
												<p class="font-medium">Not Attempted</p>
											{/if}
										{/if}
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
		<Modal title="Join Exam" bind:open={defaultModal.open} size="xs">
			<div class="text-center">
				<!-- <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" /> -->
				<!-- <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					Are you sure you want to join this Exam?
				</h3> -->
				<!-- <form method="post"> -->
                    <div class="sm:col-span-2">
						<input
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							type="text"
							id="code"
							name="code"
							bind:value={inputValue}
							on:input={handleInput}
							placeholder="Enter 6 digit code"
							required
						/>
						{#if showError}
							<small class="flex justify-start text-red-600">Exam code is required.</small>
						{/if}
					</div>
					<br/>
					<Button color="red" class="me-2" on:click={() => joinExam(defaultModal.examID)}>Join</Button>
					<Button color="alternative" on:click={() => defaultModal.open = false}>Cancel</Button>
				<!-- </form> -->
			</div>
		</Modal>
	</div>
</main>
