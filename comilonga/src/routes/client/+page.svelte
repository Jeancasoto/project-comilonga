<script>
	import NavBar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';

</script>

<svelte:head>
	<title>La comilonga</title>
	<meta name="description" content="About this app" />
</svelte:head>


<div class = "client_content">

	
	
	<NavBar />

	<div class = "quienes_somos_content">
		<div class= "quienes_somos_content_child">

			<div class="hero min-h-screen" style="background-image: url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg);">
				<div class="hero-overlay bg-opacity-60"></div>
				<div class="hero-content text-center text-neutral-content">
				  <div class="max-w-md">
					<h1 class="mb-5 text-5xl font-bold">Hello there</h1>
					<p class="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
					<button class="btn btn-primary">Get Started</button>
				  </div>
				</div>
			</div>
		</div>
	</div>
	
	<div class= "footer_div"> 
		<Footer />
	</div>
	
</div>

<style>
	.quienes_somos_content{
		display: flex;

		overflow: hidden;

		height: 50vh;
	}

	.quienes_somos_content_child{
		width: 50%;
		height: auto;

		
		padding: 15px;
	}

	.client_content{
		display: flex;
		flex-direction: column;

		overflow: scroll;
	}
</style>

