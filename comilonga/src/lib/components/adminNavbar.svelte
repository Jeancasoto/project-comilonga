<script>
	// @ts-nocheck
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { generals } from '$lib/stores/generals';
	import { onMount } from 'svelte';

	import 'iconify-icon';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { IconifyIconComponent } from 'iconify-icon';

	$: logoSRC = $generals['imagen'];

	let isLoggedIn = false;

	let showCollapse = false;
	onMount(() => {
		return auth.onAuthStateChanged((user) => {
			isLoggedIn = user !== null;
		});
	});
</script>

<nav class="bg-white sticky z-10 w-full top-0 left-0">
	<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
		<div class="w-full flex flex-col md:order-2">
			<div class="flex flex-row justify-between items-center">
				<a href="https://flowbite.com/" class="flex items-center">
					<img src={logoSRC} class="h-16 mr-3" alt="Comilonga Logo" />
				</a>

				<button
				data-collapse-toggle="navbar-sticky"
				type="button"
				class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden"
				aria-controls="navbar-sticky"
				aria-expanded="false"
				on:click={() => {
					showCollapse = !showCollapse;
				}}
			> 
			<iconify-icon  class = "text-4xl" icon={showCollapse? "mdi:chevron-up": "mdi:chevron-down"} />
			<span class="sr-only">Open main menu</span>

			</button>
				<div
					class="flex order-2 items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
					id="navbar-sticky"
				>
					<ul
						class="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0"
					>
						<li>
							<a
								href="/admin/"
								class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
								class:text-blue-700={$page.url.pathname === '/admin'}
								aria-current="page">Generales</a
							>
						</li>
						<li>
							<a
								href="/admin/productos"
								class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
								class:text-blue-700={$page.url.pathname === '/admin/productos'}>Productos</a
							>
						</li>
						<li>
							<a
								href="/admin/categorias"
								class:text-blue-700={$page.url.pathname === '/admin/categorias'}
								class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
								>Categorías</a
							>
						</li>
					</ul>
				</div>
				<div class = "flex order-3">
					<button
						class="btn btn-secondary text-white"
						on:click={async () => {
							await signOut(auth);
							goto('/admin/login');
						}}
					>
						<iconify-icon class="text-white" icon="mdi:logout" />
						Salir</button
					>

				</div>
			</div>

			<!-- MENU PARA CELULAR -->
			<div class="md:hidden">
				<div class:collapse-open={showCollapse} class="collapse border">
					<div class="collapse-content">
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<ul
							class="flex flex-col md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0"
							on:click={()=>{
								showCollapse = false;
							}}
						>
							<li>
								<a
									href="/admin/"
									class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
									class:text-blue-700={$page.url.pathname === '/admin'}
									aria-current="page">Generales</a
								>
							</li>
							<li>
								<a
									href="/admin/productos"
									class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
									class:text-blue-700={$page.url.pathname === '/admin/productos'}
									aria-current="page">Productos</a
								>
							</li>
							<li>
								<a
									href="/admin/categorias"
									class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
									class:text-blue-700={$page.url.pathname === '/admin/categorias'}
									aria-current="page">Categorías</a
								>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</nav>

<style>
	.navbar {
		background-color: rgb(255, 255, 255);
		z-index: 1;
		border-width: 4px;
	}

	.global_menu_container {
		display: flex;

		height: 50%;

		padding: 0% 2.5%;
	}

	.options_container {
		display: flex;

		width: 60%;
		/* height: 50vh; */
		align-items: center;

		justify-content: flex-start;
	}

	.signout_button {
		display: flex;

		width: 40%;
		/* height: 50vh; */
		align-items: center;

		justify-content: flex-end;
	}
</style>
