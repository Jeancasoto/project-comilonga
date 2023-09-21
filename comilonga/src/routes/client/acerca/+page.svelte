<script>
	// @ts-nocheck
	import NavBar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { getGeneralsDoc } from '$lib/helpers/firebase';
	import { onMount } from 'svelte';

	import { logo } from '../../../lib/stores/logo';

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
		console.log(generals);
	});

	$: uploadedImage = generals?.imagen ?? '';
</script>

<svelte:head>
	<title>Acerca de la comilonga</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="client_acerca_content">
	<NavBar />

	<div class="acerca_content">
		<div>
			<div class="img_content">
				<img class="img contain_img" src={uploadedImage} alt="logo comilonga" />
			</div>

		</div>
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">ACERCA DE NOSOTROS</h1>
				<p class="mb-5">
					{generals?.quienes_somos ?? ''}
				</p>
			</div>
		</div>
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">NUESTRA MISION</h1>
				<p class="mb-5">
					{generals?.nuestra_mision ?? ''}
				</p>
			</div>
		</div>
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">NUESTRA VISION</h1>
				<p class="mb-5">
					{generals?.nuestra_vision ?? ''}
				</p>
			</div>
		</div>
	</div>

	<div class="footer_div">
		<Footer />
	</div>
</div>

<style>
:root {
  --background_img: ${uploadedImage};

}
	.img_content{
		display: flex;
		justify-content: center;

		background-color: brown;
	}

	.acerca_content {
		display: flex;
		flex-direction: column;
		align-items: center;

		background-img: background_img;
	}

	.quienes_somos_content_img {
		width: 50%;
		max-width: 50%;
		height: 50vh;

		padding: 15px;
		background-color: darkkhaki;
	}
	.quienes_somos_content_text {
		width: 50%;
		height: auto;

		padding: 15px;
		background-color: aquamarine;
	}

	.client_acerca_content {
		display: flex;
		flex-direction: column;

		overflow: scroll;
	}

	.background_img {
		max-height: 120px;
		max-width: 420px;
	}

	contain_img {
		object-fit: scale-down;
	}
</style>
