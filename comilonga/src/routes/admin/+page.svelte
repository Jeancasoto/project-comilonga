<script>
	// @ts-nocheck
	import FormularioGenerales from '$lib/components/formularios/FormularioGenerales.svelte';
	import { getGeneralsDoc } from '$lib/helpers/firebase';
	import { logo } from '$lib/stores/logo';
	import { onMount } from 'svelte';

	let generals = {};
	async function fetchData() {
		try {
			await getGeneralsDoc().then((doc) => {
				generals = { ...doc.data(), id: doc.id };
				logo.set(generals.imagen);
			});
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
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
