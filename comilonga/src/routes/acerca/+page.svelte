<script>
	// @ts-nocheck
	import { generals } from '$lib/stores/generals';
	$: logoSRC = $generals['imagen'];
	$: quienes_somos = $generals['quienes_somos'] ?? '';
	$: nuestra_mision = $generals['nuestra_mision'] ?? '';
	$: nuestra_vision = $generals['nuestra_vision'] ?? '';
</script>

<svelte:head>
	<title>Acerca de la comilonga</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="client_acerca_content">
	<div class="acerca_content">
		<div>
			<div class="img_content">
				<img class="img contain_img" src={logoSRC} alt="logo comilonga" />
			</div>
		</div>
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">ACERCA DE NOSOTROS</h1>
				<p class="mb-5">
					{quienes_somos}
				</p>
			</div>
		</div>
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">NUESTRA MISION</h1>
				<p class="mb-5">
					{nuestra_mision}
				</p>
			</div>
		</div>
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">NUESTRA VISION</h1>
				<p class="mb-5">
					{nuestra_vision}
				</p>
			</div>
		</div>
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
