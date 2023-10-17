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
	let selectedCategory = '';
	let selectedCategoryName = '';

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
					selectedProduct = {};
				}}
			>
				<label class="label" for="notas">
					<span class="label-text">Notas al platillo</span>
				</label>
				<textarea
					name="notas"
					value={selectedProduct.notes ?? ''}
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
	<div class="menu_items_container">
	<div class="w-full">
		<div class="flex overflow-x-auto space-x-8 pt-2 pb-2">
			{#each categories as category}
				<button
					type="button"
					class="btn md:btn-md btn-sm btn-secondary flex-shrink-0 rounded-full"
					class:bg-primary={category.id === selectedCategory}
					on:click={() => {
						selectedCategoryName = category.nombre;
						if (selectedCategory === category.id) {
							selectedCategory = '';
							selectedCategoryName = '';
						} else {
							selectedCategory = category.id;
						}
					}}
				>
					<span>{category.nombre}</span>
				</button>
			{/each}
		</div>
		<div class="flex justify-center p-5 font-bold text-3xl">
			{#if selectedCategoryName === ''}
				<h1>Todo nuestro menú</h1>
			{/if}

			<h1>{selectedCategoryName}</h1>
		</div>
		<!-- componente que renderiza el menu -->
			{#each products as producto}
				{#if selectedCategory === '' || producto.categoria === selectedCategory}
					<div
						class="w-full flex flex-col m-2 md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 border border-white bg-white w-full cursor-pointer"
						role="button"
						tabindex="0"
					>
						<div class="bg-white grid place-items-center">
							<img src={producto.imageSRC} alt="tailwind logo" class="rounded-xl h-40 w-40" />
						</div>
						<div class="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
							<h3 class="font-black text-gray-800 md:text-xl text-xl">
								{producto.nombre}
							</h3>
							<p class="md:text-lg text-gray-500 text-base">
								{producto.descripcion}
							</p>
							<p class="text-xl text-gray-500 font-black text-gray-800">L.{producto.precio}</p>
						</div>

						<div class="cart_button">
							<button 
							class="btn btn-primary"
							on:keypress={(e) => {}}
							on:click={(e) => {
								e.stopPropagation();
								selectedProduct = { ...producto, quantity: 1 };
								shouldShowModal = true;
							}}
							>
								Agregar
								<iconify-icon icon="mdi:cart" class="text-2xl" />
								</button
							>
						</div>
					</div>
				{/if}
			{/each}
		</div>
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

	.menu_items_container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		padding: 5px 35px;

	}

	.menu_items {
		display: flex;
		flex-direction: row;
		margin: 5px 35px;

		background-color: rgb(255, 0, 204);
	}

	.cards_container {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		width: 100%;

		background-color: blue;
	}
	.card {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		align-items: center;
		justify-content: center;

		margin: 10px 0px;
		padding: 10px 0px;
	}

	.cart_button{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		justify-self: flex-end;

	}
</style>
