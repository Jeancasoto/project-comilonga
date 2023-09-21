<script>
	// @ts-nocheck
	import { db } from '$lib/firebase';
	import { collectionGroup, getDocs } from 'firebase/firestore';
	import { getFileDownloadURL } from '$lib/helpers/firebase';
	import { onMount } from 'svelte';
	import { addItem } from '$lib/stores/cart';
	import toast from 'svelte-french-toast';

	let products = [];

	async function fetchProducts() {
		const collectionRef = collectionGroup(db, 'productos');
		const querySnap = await getDocs(collectionRef);
		const productsDocs = querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		products = await Promise.all(
			productsDocs.map(async (product) => {
				const url = await getFileDownloadURL(product.imagen);
				return { ...product, imageSRC: url };
			})
		);
	}
	onMount(async () => {
		await fetchProducts();
	});
</script>

<svelte:head>
	<title>Menú La comilonga</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<div class="cards_container">
		{#each products as producto}
			<div class="card card-compact w-96 bg-base-100 shadow-xl">
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
							addItem({
								id: producto.id,
								price: parseFloat(producto.precio),
								title: producto.nombre,
								quantity: 1,
								image: producto.imageSRC
							});
							toast.success(`${producto.nombre} agregado exitosamente`);
						}}
					>
						<button class="btn btn-primary">Agregar al carrito</button>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.cards_container {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.card {
		margin: 10px 0px;
		padding: 10px 0px;
	}

	.img {
		max-height: 120px;
		max-width: 220px;
	}

	.contain_img {
		object-fit: scale-down;
	}
</style>
