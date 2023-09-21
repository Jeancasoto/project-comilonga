<script>
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
	<title>Acerca de la comilonga</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<h1>aqui deberia llamar la pagina de menu</h1>
</div>
