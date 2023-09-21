<script>
	import { cart, removeItem } from '$lib/stores/cart';
	$: total = $cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
</script>

<div class="container mx-auto">
	<h1 class="text-3xl font-bold text-center my-5">Tu carrito</h1>
	<div class="flex justify-end my-5">
		<p>
			Subtotal: <span class="font-bold">L. {total}</span>
		</p>
	</div>

	{#if $cart.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each $cart as item, idx}
				<div class="p-5 bg-base-100 rounded-xl shadow-xl">
					<img src={item.image} alt={item.title} class="w-20 h-20 object-cover rounded-full" />
					<h2 class="text-lg font-bold my-2">{item.title}</h2>
					<p>Cantidad: {item.quantity}</p>
					<p>Precio: L. {item.price.toFixed(2)}</p>
					<p>Total: L. {(item.price * item.quantity).toFixed(2)}</p>
					<button
						class="btn btn-primary"
						on:click={() => {
							removeItem(idx);
						}}>Eliminar</button
					>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-center">Tu carrito está vacío</p>
	{/if}
</div>
