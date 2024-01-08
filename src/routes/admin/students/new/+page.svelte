<script lang="ts">
    import type { PageData } from '../../questions copy/new/$types';
    
    export let data: PageData;
</script>

<div class="mx-auto max-w-8xl sm:px-6 lg:px-8 bg-white p-4">
    <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new Student</h2>
            <form action="#">
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div class="sm:col-span-2">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                        <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type question title" required="">
                    </div>
                    <div>
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                        <select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="">Select type</option>
                            <option value="multiple choice">Multiple Choices</option>
                            <option value="short answers">Short Answers</option>
                            <option value="true/false">true/false</option>
                        </select>
                    </div>
                    <div class="sm:col-span-2">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer</label>
                        <p> TODO here</p>
                        <p>When user selects multiple choice, add multiple answers options</p>
                        <p>When user selects short answers, answer is flexible text</p>
                        <p>When user selects true/false, add dropdown</p>
                    </div>
                </div>
                <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Add questionnaire
                </button> or <a href="/questions" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Cancel</a>
            </form>
        </div>
      </section>
</div>
