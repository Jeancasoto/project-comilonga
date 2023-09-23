<script>
	import { cart, removeItem } from '$lib/stores/cart';
	$: total = $cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

	async function onSubmit(e) {}
</script>

<div class="container mx-auto">
	<h1 class="text-3xl font-bold text-center my-5">Tu carrito</h1>
	<div class="flex justify-end my-5">

	</div>

	{#if $cart.length > 0}
		<div class="cards_container">
			{#each $cart as item, idx}
				<div class="card card-compact w-96 bg-base-100 shadow-xl">
					<figure>
						<img class="img contain_img" src={item.image} alt={item.title} />
					</figure>
					<div class="card-body">
						<h2 class="card-title">
							{item.title}
						</h2>
						<div class="modificar-cantidad">
							<h3>Cantidad: {item.quantity}</h3>
							<div class="join grid grid-cols-2">
								<button class="btn btn-xs btn-circle btn-outline btn-error">-</button>
								<button class="btn btn-xs btn-circle btn-outline btn-success">+</button>
							</div>
						</div>
						<p>Precio por porción: L. {item.price.toFixed(2)}</p>
						<div class="badge badge-warning badge-outline">
							Subtotal: L. {(item.price * item.quantity).toFixed(2)}
						</div>
						<div class="divider" />
						<h3>Agregar notas a la orden:</h3>
						<textarea
							name="notas{item.idx}"
							class="textarea textarea-bordered textarea-sm"
							placeholder="Ejemplo: Aderezos por aparte ..."
						/>
					</div>
				</div>
			{/each}
		</div>
		<div class="seccion-datos-cliente">
			<div class="card card-compact w-full bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="card-display">
						<div>
							<h1 class="text-3xl font-bold text-center my-5">Mis datos de cliente</h1>
							<form on:submit|preventDefault={onSubmit}>
								<label class="label">
									<span class="label-text">Nombre y apellido del cliente</span>
								</label>
								<input
									type="text"
									placeholder="Luis Sanchez"
									class="input input-bordered w-full max-w-xs"
								/>
								<label class="label">
									<span class="label-text">Numero alternativo de contacto</span>
								</label>
								<input
									type="text"
									placeholder="9754-3346"
									class="input input-bordered w-full max-w-xs"
								/>

								<div class="divider" />

								<label class="label">
									<span class="label-text">Notas para la cocina</span>
								</label>
								<textarea
									name="notas"
									class="textarea textarea-bordered textarea-sm w-full"
									placeholder="Ejemplo: Todos los productos empacados por aparte"
								/>
							</form>

						</div>
						<div class="divider lg:divider-horizontal" /> 

						<div>
							<h1 class="text-3xl font-bold text-center my-5">Resumen de mi pedido</h1>
								{#each $cart as item, idx}
								<p>
									{item.quantity} x {item.title}
								</p>
								<p>
									Nota: 
								</p>
								<!-- Aqui deberiamos agregar una validacion en un if 
								para validar si el producto tiene nota, se le ponga, de lo contrario
								no tiene sentido mostrar la nota vacia -->
								{/each}

								<div class="divider" />

								<p>
									Total: <span class="font-bold">L. {total}</span>
								</p>
							<button type="submit" class="btn btn-success">
								<iconify-icon icon="mdi:whatsapp" class="text-2xl" />
								{'Enviar a cocina'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<p class="text-center">Tu carrito está vacío</p>
	{/if}
</div>

<style>
	.cards_container {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
	.modificar-cantidad {
		display: flex;
		flex-direction: row;
	}
	.img {
		max-height: 120px;
		max-width: 220px;
	}

	.contain_img {
		object-fit: scale-down;
	}

	.card {
		margin: 10px 0px;
		padding: 10px 0px;
	}

	.seccion-datos-cliente {
		display: flex;
		justify-content: center;
	}

	.card-display {
		display: flex;
		flex-direction: row;

		justify-content: space-evenly;

		flex-wrap: wrap;

	}
</style>
