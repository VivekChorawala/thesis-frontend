<script lang="ts">
	import { EditOutline, InfoCircleOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import type { PageData } from './$types';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Spinner,
		TableSearch
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { exams } from '../../api/admin/exam';
	import moment from 'moment';
	export let data: PageData;
	let examList: any = [];
	let loading: any = false;
	$: loading;
	let { getAllExams } = exams();
	let searchTerm = '',
		user: any;

	async function getExams() {
		let apiCall = await getAllExams();
		if (apiCall.status == 'success') {
			examList = apiCall.data;
			if (examList.length > 0) {
				examList = examList.filter((item: any) => item.student_exam_finished_at != null);
			}
		} else {
			examList = [];
		}
	}
	$: filteredItems = examList.filter((item: any) => {
		return (
			item.student_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
			item.exam_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
			item.subject_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
		);
	});
	onMount(async () => {
		loading = true;
		await getExams();
		loading = false;
	});
</script>

<main>
	{#if loading == false}
		<div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4 mt-10">
			<div class="flex items-center justify-between gap-x-6 py-4">
				<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Exams</h1>
			</div>
			
		{#if examList.length > 0 }
			<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
				{#if filteredItems.length > 0}
					<Table>
						<TableHead>
							<!-- <TableHeadCell>Student ID</TableHeadCell> -->
							<TableHeadCell>Student name</TableHeadCell>
							<!-- <TableHeadCell>Exam ID</TableHeadCell> -->
							<TableHeadCell>Exam name</TableHeadCell>
							<TableHeadCell>Student Exam Start Time</TableHeadCell>
							<TableHeadCell>Student Exam End Time</TableHeadCell>
							<!-- <TableHeadCell>SUbject ID</TableHeadCell> -->
							<TableHeadCell>Subject name</TableHeadCell>
							<!-- <TableHeadCell>Exam Start Time</TableHeadCell>
							<TableHeadCell>Exam End Time</TableHeadCell> -->
							<TableHeadCell>Duration</TableHeadCell>
							<TableHeadCell>Total Questions</TableHeadCell>
							<TableHeadCell>Student Result</TableHeadCell>
							<TableHeadCell>Action</TableHeadCell>
						</TableHead>
						<TableBody tableBodyClass="divide-y">
							{#each filteredItems as item, i}
								<TableBodyRow>
									<!-- <TableBodyCell>{item.student_id}</TableBodyCell> -->
									<TableBodyCell>{item.student_name}</TableBodyCell>
									<!-- <TableBodyCell>{item.exam_id}</TableBodyCell> -->
									<TableBodyCell>{item.exam_name}</TableBodyCell>
									<TableBodyCell
										>{moment(item.student_exam_start_time).format(
											'YYYY-MM-DD HH:mm:ss A'
										)}</TableBodyCell
									>
									<TableBodyCell
										>{moment(item.student_exam_start_time).format(
											'YYYY-MM-DD HH:mm:ss A'
										)}</TableBodyCell
									>
									<!-- <TableBodyCell>{item.subject_id}</TableBodyCell> -->
									<TableBodyCell>{item.subject_name}</TableBodyCell>
									<!-- <TableBodyCell
										>{moment(item.exam_start_time).format('YYYY-MM-DD HH:mm:ss A')}</TableBodyCell
									>
									<TableBodyCell
										>{moment(item.exam_finish_time).format('YYYY-MM-DD HH:mm:ss A')}</TableBodyCell
									> -->
									<TableBodyCell>{item.exam_duration}</TableBodyCell>
									<TableBodyCell>{item.total_questions}</TableBodyCell>
									<TableBodyCell>{item.student_result}</TableBodyCell>
									<TableBodyCell>
										<div class="flex items-center gap-2">
											<a
												href="/admin/exams/{item.exam_id}/{item.student_id}"
												class="font-medium text-primary-500 hover:underline dark:text-primary-400"
											>
												<InfoCircleOutline class="w-5 h-5 text-black" />
											</a>
											<!-- <a href="/exams/1/questions" class="font-medium text-primary-500 hover:underline dark:text-primary-400">Questions</a>   -->
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
		</div>
	{:else}
		<div class="">
			<Spinner color="purple" style="top: 50%;left: 50%;position: absolute;" />
		</div>
	{/if}
</main>
