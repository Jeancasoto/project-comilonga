<script>
	// @ts-nocheck
	import { cart } from '$lib/stores/cart';
	import { generals } from '$lib/stores/generals';
	import { page } from '$app/stores';

	$: amount = $cart.length;
	$: logoSRC = $generals['imagen'];

	let showCollapse = false;
</script>

<nav class="bg-white sticky z-10 w-full top-0 left-0">
	<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
		<div class="w-full flex flex-col md:order-2">
			<div class="flex flex-row justify-between items-center">
				<a href="/acerca" class="flex items-center">
					<img src={logoSRC} class="h-16 mr-3" alt="Comilonga Logo" />
				</a>

				<button
					data-collapse-toggle="navbar-sticky"
					type="button"
					class="flex flex-col w-full items-center p-2 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden"
					aria-controls="navbar-sticky"
					aria-expanded="false"
					on:click={() => {
						showCollapse = !showCollapse;
					}}
				>
					{#if $page.url.pathname === '/acerca'}
						Acerca de nosotros
					{:else if $page.url.pathname === '/'}
						Menú
					{:else if $page.url.pathname === '/carrito'}
						Carrito
					{/if}

					<iconify-icon
						class="text-4xl"
						icon={showCollapse ? 'mdi:chevron-up' : 'mdi:chevron-down'}
					/>
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
								href="/"
								class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-secondary md:p-0 md:dark:hover:text-secondary font-bold"
								class:text-secondary={$page.url.pathname === '/'}
								class:text-gray-900={$page.url.pathname !== '/'}
							>
								Menú
							</a>
						</li>
						<li>
							<a
								href="/acerca"
								class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-secondary md:p-0 md:dark:hover:text-secondary font-bold"
								class:text-secondary={$page.url.pathname === '/acerca'}
								class:text-gray-900={$page.url.pathname !== '/acerca'}
							>
								Acerca de nostros
							</a>
						</li>
					</ul>
				</div>
				<div class="flex order-3">
					<a href="/carrito">
						<button class="btn btn-ghost btn-circle" type="button">
							<div class="indicator">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
									/></svg
								>
								<span class="badge badge-sm indicator-item">{amount}</span>
							</div>
						</button>
					</a>
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
							on:click={() => {
								showCollapse = false;
							}}
						>
							<li>
								<a
									href="/"
									class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-secondary md:p-0 md:dark:hover:text-blue-500"
									class:text-secondary={$page.url.pathname === '/'}
									aria-current="page">Menú</a
								>
							</li>
							<li>
								<a
									href="/acerca"
									class="block py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-secondary md:p-0 md:dark:hover:text-blue-500"
									class:text-secondary={$page.url.pathname === '/acerca'}
									aria-current="page">Acerca de nosotros</a
								>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</nav>
