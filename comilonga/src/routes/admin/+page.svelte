<script>
	import Generals from '$lib/components/generals.svelte';
	import Formulario from '$lib/components/FormularioProductos.svelte';
	import { logo } from '$lib/store';
	// ejemplo de lo que la linea de arriba sustituye
	// import Generals from '../../components/generals.svelte';

	let logo_url ; 

	logo.subscribe((data) => {
		logo_url = data;
		console.log(data);
		console.log(logo);
		console.log(logo_url);
	});


</script>


<svelte:head>
	<title>Admin la comilonga</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="admin_wrapper">
	<div class="wrapper_container">
		<div class="left_menu drawer lg:drawer-open ">
			<div class="menu_logo_container">
				<div class="logo_container">
					<div class="avatar">
						<div class="w-38 rounded-full">
							<img
								alt="Logo comilonga"
								src= {logo_url}
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="menu_options_container">
				<button class="btn btn-outline">Generales</button>
				<button class="btn btn-outline">Productos</button>
			</div>
			<div class="menu_exit_container">
				<button class=" btn btn-outline">Salir</button>
			</div>
		</div>

		<Generals />
	</div>
</div>

<style>
	.btn {
		width: 100%;
		border-radius: 0;
		border-width: 0.2 rem;
		border-color:#9DB2BF;

		margin-top: 2px;
	}
	.btn:hover{
	
		background-color: #C4DFDF;
	}
	.left_menu {
		max-width: 20vw;
		height: 100%;

		display: flex;
		flex-direction: column;

		justify-content: space-between;

		border-color: rgb(195, 219, 224);
		border-width: 1px;

		background-color: #D2E9E9;
	}
	.menu_logo_container {
		height: 35vh;
	}
	.menu_options_container {
		height: 35vh;
		width: 100%;
	}
	.menu_exit_container {
		display: flex;
		align-items: end;
		width: 100%;
		height: 30vh;
	}

	.wrapper_container {

		width: 100%;

		display: flex;
	
		overflow: scroll;

		background-color: #E3F4F4;
	}

	.admin_wrapper {

		width: 100%;

		display: flex;
		flex-direction: row;
	}

	.logo_container {
		display: flex;

		justify-content: center;
		align-items: center;

		padding: 10% 0%;
	}
</style>
