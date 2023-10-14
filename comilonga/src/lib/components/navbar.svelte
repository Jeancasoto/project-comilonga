<script>
	// @ts-nocheck
	import { cart } from '$lib/stores/cart';
	import { generals } from '$lib/stores/generals';
	$: amount = $cart.length;
	$: total = $cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
	$: logoSRC = $generals['imagen'];
</script>

<div class="navbar bg-base-100">
	<div class="rounded-full">
		<a href="/">
			<img src={logoSRC} alt="Logo la comilonga" class="w-20 object-scale-down" />
		</a>
	</div>
	<div class="flex-1 ml-4">
		<a class="font-bold normal-case text-xl" href="/acerca">Acerca de Nosotros</a>
	</div>
	<div class="flex-none">
		<div class="dropdown dropdown-end">
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
</div>

<style>
	.navbar {
		background-color: rgb(255, 255, 255);
		z-index: 1;
		border-width: 4px;
	}
</style>
