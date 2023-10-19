<script>
	// @ts-nocheck
	import { whatsappMessageTemplate } from '$lib/helpers/general';
	import { generals } from '$lib/stores/generals';
	import { cart, removeItem } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	import { extractErrors } from '$lib/helpers/general';
	import * as yup from 'yup';
	import 'iconify-icon';
	import { addDoc, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let cliente = {
		nombre: '',
		numero: '',
		notasCocina: '',
		tipoDePedido: 'local',
		tipoDePago: 'efectivo'
	};

	$: total = $cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
	$: redes_sociales = $generals['redes_sociales'] ?? {};

	$: numero = redes_sociales['whatsapp_link'];

	let errors = {};
	const schema = yup.object().shape({
		nombre: yup.string().required('Por favor ingresar un nombre').ensure(),
		numero: yup.string().required('Por favor ingresar un numero').ensure(),
		notas: yup.string()
	});
	function purgeCart(item) {
		return {
			id: item.id,
			quantity: item.quantity
		};
	}
	async function onSubmit(e) {
		try {
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			await schema.validate(data, { abortEarly: false });
			const collectionRef = collection(db, 'mensajes_enviados');

			await addDoc(collectionRef, {
				tipoDePago: cliente.tipoDePago,
				tipoDePedido: cliente.tipoDePedido,
				total,
				items: $cart.map(purgeCart),
				date: new Date().toISOString()
			});
			goto(
				`https://wa.me/504${numero}?text=${whatsappMessageTemplate(
					data.nombre,
					data.numero,
					data?.notasCocina ?? '',
					cliente.tipoDePedido,
					cliente.tipoDePago,
					$cart
				)}`
			);
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				errors = extractErrors(error);
			}
		}
	}
</script>

<div class="container mx-auto flex flex-col lg:flex-row">
	<div class="flex flex-col items-start w-3/4">
		<h1 class="text-3xl font-bold text-center my-5">Tu carrito</h1>

		{#if $cart.length > 0}
			<div class="flex flex-col gap-4 w-full lg:w-3/4 p-4">
				{#each $cart as item, idx}
					<div class="flex flex-row p-4 md:flex-wrap-none flex-wrap">
						<div class="flex flex-col gap-2 mr-20">
							<h2 class="text-xl capitalize text-wrap">{item.title}</h2>
							<div class="btn-group">
								<button
									class="btn btn-primary btn-sm"
									type="button"
									on:click={() => {
										if (item.quantity > 1) {
											item.quantity--;
										} else {
											removeItem(idx);
										}
									}}
								>
									{#if item.quantity == 1}
										<iconify-icon icon="mdi:trash" />
									{:else}
										<iconify-icon icon="mdi:minus" />
									{/if}
								</button>
								<div class="btn btn-primary btn-sm hover:bg-primary hover:cursor-default">
									{item.quantity}
								</div>
								<button
									class="btn btn-primary btn-sm"
									type="button"
									on:click={() => {
										item.quantity++;
									}}
								>
									<iconify-icon icon="mdi:plus" />
								</button>
							</div>
						</div>
						<div class="flex flex-col">
							<p class="text-gray-600">Descripcion: {item.description ?? ''}</p>
							<br />
							<p class="text-gray-600">Notas: {item.notes ?? ''}</p>
						</div>
						<div class="flex flex-row justify-end gap-2 w-full">
							<h2 class="text-2xl">L. {(item.price * item.quantity).toFixed(2)}</h2>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-center">Tu carrito está vacío</p>
		{/if}
	</div>
	<div class="w-full lg:w-1/4">
		<div class="card card-compact w-full bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="card-display">
					<div>
						<h1 class="text-3xl font-bold text-center my-5">Mis datos de cliente</h1>
						<form on:submit|preventDefault={onSubmit}>
							<label class="label" for="nombre">
								<span class="label-text">Nombre y apellido del cliente</span>
							</label>
							<input
								name="nombre"
								type="text"
								placeholder="Luis Sanchez"
								class="input input-bordered w-full max-w-xs"
								on:input={(e) => {
									cliente.nombre = e.target.value;
								}}
							/>
							{#if errors.nombre}
								<label class="label" for="nombre">
									<span class="label-text-alt text-red-500">{errors.nombre}</span>
								</label>
							{/if}
							<label class="label" for="numero">
								<span class="label-text">Numero alternativo de contacto</span>
							</label>
							<input
								name="numero"
								type="text"
								placeholder="9754-3346"
								class="input input-bordered w-full max-w-xs"
								on:input={(e) => {
									cliente.numero = e.target.value;
								}}
							/>
							{#if errors.numero}
								<label class="label" for="numero">
									<span class="label-text-alt text-red-500">{errors.numero}</span>
								</label>
							{/if}
							<div class="flex flex-col">
								<label class="label" for="retiro">
									<span class="label-text">¿Como desea su pedido?</span>
								</label>
								<div class="join">
									<input
										class="join-item btn"
										type="radio"
										name="tipoDePedido"
										aria-label="Para el local"
										on:click={() => {
											cliente.tipoDePedido = 'local';
										}}
										checked={cliente.tipoDePedido === 'local'}
									/>
									<input
										class="join-item btn"
										type="radio"
										name="tipoDePedido"
										aria-label="Para llevar"
										on:click={() => {
											cliente.tipoDePedido = 'llevar';
										}}
										checked={cliente.tipoDePedido === 'llevar'}
									/>
								</div>
							</div>
							<div class="flex flex-col">
								<label class="label" for="pago">
									<span class="label-text">¿Pagará en efectivo o Tarjeta?</span>
								</label>
								<div class="join">
									<input
										class="join-item btn"
										type="radio"
										name="tipoDePago"
										aria-label="Efectivo"
										on:click={() => {
											cliente.tipoDePago = 'efectivo';
										}}
										checked={cliente.tipoDePago === 'efectivo'}
									/>
									<input
										class="join-item btn"
										type="radio"
										name="tipoDePago"
										aria-label="Tarjeta"
										on:click={() => {
											cliente.tipoDePago = 'tarjeta';
										}}
										checked={cliente.tipoDePago === 'tarjeta'}
									/>
								</div>
							</div>
							<div class="divider" />

							<label class="label" for="notas">
								<span class="label-text">Notas para la cocina</span>
							</label>
							<textarea
								name="notas"
								class="textarea textarea-bordered textarea-sm w-full"
								placeholder="Ejemplo: Todos los productos empacados por aparte"
								on:input={(e) => {
									cliente.notasCocina = e.target.value;
								}}
							/>
							<div class="divider w-full" />
							<div>
								<p>
									Total: <span class="font-bold">L. {total}</span>
								</p>
								{#if $cart.length > 0}
									<button type="submit" class="btn btn-success">
										<iconify-icon icon="mdi:whatsapp" class="text-2xl" />
										{'Enviar a cocina'}
									</button>
								{/if}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.card {
		margin: 10px 0px;
		padding: 10px 0px;
	}

	.card-display {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}
</style>
