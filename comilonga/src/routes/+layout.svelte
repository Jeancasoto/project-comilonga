<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import './styles.css';
	import { Toaster } from 'svelte-french-toast';
	import { getGeneralsDoc } from '$lib/helpers/firebase';
	import { generals } from '$lib/stores/generals';
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import { auth as authStore } from '$lib/stores/auth';
	import AdminNavbar from '$lib/components/adminNavbar.svelte';
	import { page } from '$app/stores';
	async function fetchData() {
		try {
			const doc = await getGeneralsDoc();
			generals.set(doc);
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		await fetchData();
	});
</script>

<div class="app">
	<Toaster />
	<main>
		{#if $page.url.pathname.startsWith('/admin')}
			<AdminNavbar />
		{:else}
			<Navbar />
		{/if}
		<slot />
		<Footer />
	</main>
</div>
