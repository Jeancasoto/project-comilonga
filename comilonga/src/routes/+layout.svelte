<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import './styles.css';
	import { Toaster } from 'svelte-french-toast';
	import { getGeneralsDoc } from '$lib/helpers/firebase';
	import { generals } from '$lib/stores/generals';
	async function fetchData() {
		try {
			const doc = await getGeneralsDoc();
			generals.set({ ...doc.data(), id: doc.id });
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
		<slot />
	</main>
</div>
