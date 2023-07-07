<script>
	import Generals from '$lib/components/generals.svelte';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="admin_wrapper">
	<div class="left_menu">
		<h1>div izq</h1>
		<div class="menu_logo_container">
			<h1>div foto</h1>
		</div>
		<div class="menu_options_container">
			<button>Generales</button>
			<button>Productos</button>
			<h1>div opciones</h1>
		</div>
		<div class="menu_exit_container">
			<button>Salir</button>
			<h1>div salir</h1>
		</div>
	</div>
	<div class="wrapper_container">
		<h1>div derecha</h1>
		<Generals />
	</div>
</div>

<style>
	.left_menu {
		height: 100vh;
		width: 20%;

		display: flex;
		flex-direction: column;

		background-color: black;
	}

	.wrapper_container {
		height: 100vh;
		width: 80%;
		background-color: blue;
	}

	.admin_wrapper {
		display: flex;
		align-items: center;
	}

	.menu_logo_container {
		background-color: aliceblue;

		height: 30%;
	}
	.menu_options_container {
		background-color: rgb(237, 212, 212);

		display: flex;
		flex-direction: column;
		height: 35%;
	}
	.menu_exit_container {
		display: flex;
		flex-direction: column;

		background-color: rgb(213, 234, 234);
	}

	.form_container {
		display: flex;
		flex-direction: column;
		background-color: black;
	}

	.form_section_container {
		background-color: rebeccapurple;
	}

	.form_section_savebutton {
		display: flex;
		justify-content: center;
	}
</style>
