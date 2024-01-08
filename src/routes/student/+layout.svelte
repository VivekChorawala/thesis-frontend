<script lang="ts">
	import '../../app.css';
	// import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownHeader, DropdownItem, DropdownDivider } from 'flowbite-svelte'
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import type { LayoutData } from '../$types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { professorExams } from '../api/professor/exams';
	export let data: LayoutData;
	let user:any = {};
	let userName:any, userEmail: any;
	$: userName, userEmail;
	$: user;
	$: activeUrl = $page.url.pathname;

	let show = false;

	function toggle() {
		show = !show;
	}
	let slug = $page.url.pathname.split('/')[1];
    let { userLogout } = professorExams();

	onMount(() => {
		user = localStorage.getItem('user');
		user = JSON.parse(user);
		userName = user.first_name + ' ' + user.last_name
		userEmail = user.email
		if (user !== "" && user !== null && user.role == slug) {
			// goto(`/${user.role}/dashboard`);
			goto(`${activeUrl}`);
		} else {
			goto(`/signin/${slug}`);
		}
	});
    async function logout() {
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);
		if (user !== "" && user !== null) {
			let userLogoutResponse = await userLogout();
			if(userLogoutResponse.statusCode == 'success') {
				redirect(user.role);
			}
		} else {
			redirect('')			
		}
    }
	function redirect(role) {
		localStorage.removeItem("user");		
		if(role == 'admin') {
            goto('/signin/admin');
        } else if(role == 'professor') {
            goto('/signin/professor');
        } else {
            goto('/signin/student');
        }
	}
</script>

<div class="min-h-full relative">
	<!-- <nav class="bg-white shadow-sm">
		<div class="max-w-8xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between"> -->
				<Navbar  let:hidden let:toggle>
					<NavBrand href="/">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAExklEQVR4nO2dz28bRRTHVwiJC0hwAi78+AcqBIeKH1I4ABforT841CmqEbeaW39wwCkIJU0doFXTxKqb2DuzsXdClR9FAWcn+EAoTuixadUDtFXLEdoiCALUDJotkYid/ZGsvbPOfD/Sk6Ik8zzzvjvvPW9mHcMAAAAAAAAAAAAAACDBZLPZB3jF2sEZueAwctFhZnetVntQ9by2PPOThUc4I+9zRm9wRsUas8mP3LYO1SZGH1U9zy1HlZnPOoz0OTa93RT4ZrvLGTnhsNJTqufd8XzDrBccRkzHJv+ECHyj3eM2Oe8w60XV6+jI/O4wMu8X4C+Lw6L8eZ9r8mvOiOfvok6EzO8Os97jjF71DLxNxPTZIWF9+oko9WXXmPzeVGFQOLa3EJzRn1AnGvjqHHnSsUmPw8ivnldwxRSTZ04Jmvu4KfCNRo9/JCbyJ8VsxfTeETb9TdaJuS/o04au8Ap53s3vjP7tFahqueQGk/QfDQx8o5n9R8W505+J6lgxsE7MjZsvGZr1745ffv/aGnGDZx7r2XDgm+xYjxg/NeD69HvNLV0naow97OZ3m1zxC8KMeUbYJ/ujB93DpO8ZsxDUPW2dOlFjo0/I/M4Z+SW4o+ltW+AbLVTn1Ml1osroc5yRvMPon4EdzUBzRxOXydeWxT2gc3LrRLVCXzaSnt+divWanKzf1T67gY6mFJOF6ZwSWydmZk48JCflMLrkN/koHU0pJiPhOicpxDVZJ761rMeUBZ6PjT3u9u8V805sHU1fTBayc5qtmMuyTtTK5WfiC/z42Lb7+Z0sq+xoSjFZyM5p9b7TK+0XwH8i2psBAajSiwACMAigdRoy4iaXSa8MZNJCR8tl0iuxBxwCpNeIoDr+Ru5A+pa2O+BA+prq+Bu5zLtvDWT239Qv+Ptv5DLp142kIP+itWqc0d893jmK1Kvb1zUeosDJm2Ze4zfiJ+o8lBTbIKIGkIdceCsEaMU8jKTBGfk5aNKTZ4c8Fz41Iu/P+4+fGvEevxE/E4VBn/FDwQIyoj73N3L/KAm95Re8w927PBd+eN9uMe2zePmzQ6ndgQIc6d7jK4K8CA7u3ek9j+5dYnp0+J7P7rkub7sbSeXKxbpYz4ICl/rPoo5viZ+u7Xe9xhtJBwIoBgJ0uACXf/i+JSkokh+dU9BlCAABUtgBdaQgpKC6pjVg8UJrinAUP1qnoEUIAAG6sAMEUpCiFLTUovcBkfzovAOWIAAESGEH1JGCkILqmtaAxda8D4jkR+sUtAgBIEAXdoBAClKVgha+a00NiOJH6x2wAAEgQBd2gEAKQgoSWtaASwvzLSnCkfzonIIuQYDNMTdO3lj34yRXD9cW8+4BXK/AH9y7U0wWTvucjB52D94GCXhk3x4xPZrftJ8P3nlbTI3kV7wP59KbDiNvGknDL/hhjpdPFAYDj4XLE9JBAvgF//8ieI0/H2K8PAVuJI2wDzZ4LXy2XIo0ftWiziPMWMcm6p+O1FkAnqQnZIq92WXVH6hRUmTF3g/V7wQIoBgIoBgIoBgIoBgIEDNh2zRdzYhBAM9naGG0/QJs8p8paGNGu+GM/KV6kVxnAXw/jhgm2i4At+kfCDRVtwMAAAAAAAAAAAAAgNGp/AsQg9AyBKdKRQAAAABJRU5ErkJggg==" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
						<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Quizcademy</span>
					</NavBrand>
					<div class="flex items-center md:order-2">
						<Avatar id="avatar-menu" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC4klEQVR4nO2Zz04UQRDGf1ndaOCCgigB/4QTN4OJBjzoK5CogYjx7hOAnDwokKhriJiF+AiIRlEv+hKueJOo6AnF2ypLwrbppEw2kxm2uqdH1zhfUklnZvurqp7qqupeyJEjRwjsAYaBKWAZeAd8B7ZF7HhV3tnfDAEFWgBHgVngC2Ac5TMwA/T9DcMPAYtAzcPwqNSAMtD1p4y/DGwGMDwq34CxLA0vAg8zMNxEZEF0BUUb8NLBiCrwFLgLlGRcdZj/QnQGQdHB+DpwB+iI4ekQZ+pKruehvoQ2bKxh4wq+Kw5OlNMaP+7w2e3Ka3HPgXc0TarUZptqQtgk4QDwQ8n9Fej0cWDRYZWeefDbGNfyP3Al73MsUrc9HLAZSstvbTnmQj7rQO4a/z4OGGk71I2Za2+TdQgZYF3bAA47Evts4oMOm9g0yBkN+ZQHsZEipcWcp45JDfmyJ3ldilQzXHUoZCYiSxoHVj3JfztRkjwfFzZzKYw3QEXjQIhW2cb3ijhTkrFPzJuYotYUIQ4pWcnWf+HAZgsYatKEUJpNnLVUNA48bgFDTZo0et2D+CfwCrgJXADOAv1Au0i/PLsI3AJeSzwbR5nQODCkJKtJ0RvxPL/aOSPyxbeVOk9riAty6ZREsiNnheOEwwk5uu7soveTy23eTAKJ7VLPkR3O79IJT6c90Nj0OkD2GIhJ5Xa/9LoSlWM26iDZ45ToatR934eoS677GoneA4fJDkeAtYjODWkEvTAWE4tvgW7CozuhiF5KS7wQQ/oBOEk4DAIfY/TMhyC3Z+QnCcXrBrAvBXdRilM05o2cmfcSCG1y4RqX3mzMXnMsZu0yZy2BcyXk5W7jakUzU/RgvySG2WreA+wX6ZFn9t2jJjfV8yFXPg6j0taawLIRYsNq0SnXfT4NWVS2JM97p8o06JW2Y93DcDtn2qfCZoGCXDpNyj6oSDtQE7HjN/JuQrrKlvibNUcO/nH8AnwEgDk6TrLPAAAAAElFTkSuQmCC" class="cursor-pointer" />
						<NavHamburger on:click={toggle}  class1="w-full md:flex md:w-auto md:order-1" />
					</div>
					<Dropdown placement="bottom" triggeredBy="#avatar-menu" >
						<DropdownHeader>
							<span class="block text-sm">{userName}</span>
							<span class="block truncate text-sm font-medium">{userEmail}</span>
						</DropdownHeader>
						<!-- <DropdownItem>Settings</DropdownItem>
						<DropdownDivider /> -->
						<DropdownItem>
							<!-- <NavLi href="/student/logout">Logout</NavLi> -->
							<!-- <NavLi href="/signin/student">Logout</NavLi> -->
							<NavLi on:click={logout}>Logout</NavLi>
						</DropdownItem>
						
					</Dropdown>
					<NavUl>
						<NavLi href="/student/dashboard" active={true}>Home</NavLi>
						<!-- <NavLi href="/dashboard">Dashboard</NavLi> -->
						<!-- <NavLi href="/students">Students</NavLi> -->
						<!-- <NavLi href="/professors">Professors</NavLi>
						<NavLi href="/subjects">Subjects</NavLi> -->
						<NavLi href="/student/exams">Exams</NavLi>
						<!-- <NavLi href="/questions">Questions</NavLi> -->
					</NavUl>
				</Navbar>
			<!-- </div>
		</div>
	</nav> -->
	<div class="max-w-8xl  mx-auto container">
		<slot />
	</div>
	<Footer class="absolute bottom-0 start-0 w-full text-center">
		<FooterCopyright href="/" by="FVNZ2P" year={2023} />
	</Footer>
</div>
