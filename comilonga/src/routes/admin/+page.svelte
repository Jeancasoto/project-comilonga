<script>
	// @ts-nocheck
	import FormularioGenerales from '$lib/components/formularios/FormularioGenerales.svelte';
	import { getGeneralsDoc } from '$lib/helpers/firebase';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';

	let generals = {};
	async function fetchData() {
		try {
			const doc = await getGeneralsDoc();
			generals = doc;
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		if (auth.currentUser === null) {
			goto('/admin/login');
		}
		await fetchData();
	});
</script>

<svelte:head>
	<title>Admin la comilonga</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<FormularioGenerales {generals} />
</div>
