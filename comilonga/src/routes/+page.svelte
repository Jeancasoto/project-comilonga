<script>
	// @ts-nocheck
	import { db } from '$lib/firebase';
	import { collectionGroup, getDocs, where, query } from 'firebase/firestore';
	import { getFileDownloadURL } from '$lib/helpers/firebase';
	import { onMount } from 'svelte';
	import { addItem } from '$lib/stores/cart';
	import toast from 'svelte-french-toast';
	import 'iconify-icon';
	let products = [];
	let categories = [];
	let shouldShowModal = false;
	let selectedProduct = {};

	async function fetchProducts() {
		const collectionRef = query(collectionGroup(db, 'productos'), where('is_visible', '==', true));
		const querySnap = await getDocs(collectionRef);
		const productsDocs = querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		products = await Promise.all(
			productsDocs.map(async (product) => {
				const url = await getFileDownloadURL(product.imagen);
				return { ...product, imageSRC: url };
			})
		);
	}

	async function fetchCategories() {
		const collectionRef = query(collectionGroup(db, 'categorias'), where('is_visible', '==', true));
		const querySnap = await getDocs(collectionRef);
		categories = querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	}

	onMount(async () => {
		await fetchProducts();
		await fetchCategories();
	});
</script>

<svelte:head>
	<title>Menú La comilonga</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<div class="modal" class:modal-open={shouldShowModal}>
		<div class="modal-box">
			<div class="flex justify-between mb-6 items-center">
				<div class="flex flex-col w-full">
					<div class="flex justify-between items-center w-full">
						<h1 class="text-3xl capitalize">{selectedProduct.nombre}</h1>
						<button class="text-error font-bold" on:click={() => (shouldShowModal = false)}>
							<iconify-icon icon="mdi:close" height={32} width={32} />
						</button>
					</div>
					<h1 class="text-md text-gray-600 capitalize">{selectedProduct.descripcion}</h1>
				</div>
			</div>
			<form
				on:submit={(e) => {
					shouldShowModal = false;
					addItem({
						id: selectedProduct.id,
						price: parseFloat(selectedProduct.precio),
						title: selectedProduct.nombre,
						quantity: selectedProduct.quantity,
						image: selectedProduct.imageSRC,
						notes: selectedProduct.notes,
						description: selectedProduct.descripcion
					});
					toast.success(`${selectedProduct.nombre} agregado exitosamente`);
				}}
			>
				<label class="label" for="notas">
					<span class="label-text">Notas al platillo</span>
				</label>
				<textarea
					name="notas"
					class="textarea textarea-bordered textarea-sm resize-none w-full"
					placeholder="Ejemplo: Aderezos por aparte ..."
					on:input={(e) => {
						selectedProduct.notes = e.target.value;
					}}
				/>
				<div class="flex flex-row w-full justify-between items-center mt-4">
					<div class="btn-group">
						<button
							class="btn btn-secondary"
							type="button"
							on:click={() => {
								if (selectedProduct.quantity > 1) selectedProduct.quantity--;
							}}
						>
							-
						</button>
						<div class="btn btn-secondary hover:bg-secondary hover:cursor-default">
							{selectedProduct.quantity}
						</div>
						<button
							class="btn btn-secondary"
							type="button"
							on:click={() => {
								selectedProduct.quantity++;
							}}
						>
							+
						</button>
					</div>
					<button class="btn btn-success" type="submit"> Agregar </button>
				</div>
			</form>
		</div>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 grid-flow-row gap-2 lg:gap-4">
		<!-- {#each products as producto}
			<div class="card card-compact w-96 bg-base-100 shadow-xl justify-self-center">
				<figure>
					<img class="img contain_img" src={producto.imageSRC} alt={producto.nombre} />
				</figure>
				<div class="card-body">
					<h2 class="card-title">
						{producto.nombre}
						<div class="badge badge-accent badge-outline">L. {producto.precio}</div>
					</h2>
					<p>{producto.descripcion}</p>
					<button
						type="button"
						class="card-actions justify-end"
						on:click={() => {
							selectedProduct = { ...producto, quantity: 1 };
							shouldShowModal = true;
						}}
					>
						<button class="btn btn-primary">Agregar al carrito</button>
					</button>
				</div>
			</div>
		{/each} -->
		{#each products as producto}
			<div
				class="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md justify-self-center"
			>
				<a class="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
					<img class="object-cover w-full" src={producto.imageSRC} alt={producto.nombre} />
				</a>
				<div class="mt-4 px-5 pb-5">
					<a href="#">
						<h5
							class="text-3xl tracking-tight text-slate-900 whitespace-break break-keep capitalize"
						>
							{producto.nombre}
						</h5>
					</a>
					<div
						class="mt-2 mb-5 flex flex-col items-start justify-center text-truncate overflow-hidden"
					>
						<p>
							<span class="text-xl font-bold text-slate-900">L {producto.precio}</span>
						</p>
						<p class="text-sm font-italic text-grey-900 max-lines">
							{producto.descripcion}
						</p>
					</div>

					<button
						type="button"
						class="btn btn-secondary w-full"
						on:click={() => {
							selectedProduct = { ...producto, quantity: 1 };
							shouldShowModal = true;
						}}
					>
						<iconify-icon icon="mdi:cart" class="mr-4" />
						Agregar al carrito
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.img {
		max-height: 120px;
		max-width: 220px;
	}

	.contain_img {
		object-fit: scale-down;
	}
	.max-lines {
		display: block; /* or inline-block */
		text-overflow: ellipsis;
		word-wrap: break-word;
		overflow: hidden;
		max-height: 3.6em;
		line-height: 1.8em;
	}
</style>
