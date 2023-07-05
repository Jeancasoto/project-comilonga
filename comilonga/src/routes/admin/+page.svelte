<script>
	import Generals from "../../components/generals.svelte";
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="admin_wrapper">
	<div class = "left_menu">
		<h1>div izq</h1>
		<div class = "menu_logo_container">
			<h1>div foto</h1>
		</div>
		<div class = "menu_options_container">
			<button>Generales</button>
			<button>Productos</button>
			<h1>div opciones</h1>
		</div>
		<div class= "menu_exit_container">
			<button>Salir</button>
			<h1>div salir</h1>
		</div>
	</div>
	<div class = "wrapper_container">
		<h1>div derecha</h1>
		<Generals/>
	</div>

</div>
