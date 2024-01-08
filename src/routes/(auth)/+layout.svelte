<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	onMount(() => {
		let slug = $page.params.slug;
		let user: any = localStorage.getItem('user');
		user = JSON.parse(user);
		if (user !== "" && user !== null) {
			goto(`/${user.role}/dashboard`);
		} else {
			if(slug) {
				goto(`/signin/${slug}`);
			} else {
				goto($page.url.href);
			}
		}
	});
</script>

<slot />
