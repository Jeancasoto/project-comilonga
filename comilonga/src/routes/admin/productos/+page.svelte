<script>
	// @ts-nocheck
	import { db } from '$lib/firebase';
	import { collectionGroup, deleteDoc, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
	import { getFileDownloadURL } from '$lib/helpers/firebase';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import FormularioProductos from '$lib/components/FormularioProductos.svelte';
	import toast from 'svelte-french-toast';
	let products = [];
	let selectedProduct = {};
	let shouldShowModal = false;
	let modalType = '';

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

<div class="flex justify-center flex-col">
	<div class="modal" class:modal-open={shouldShowModal}>
		<div class="modal-box">
			{#if modalType === 'CREATE' || modalType === 'EDIT'}
				<FormularioProductos
					producto={modalType === 'EDIT' ? selectedProduct : undefined}
					on:success={async () => {
						shouldShowModal = false;
						await fetchProducts();
						toast.success(`Producto ${modalType === 'EDIT' ? 'editado' : 'creado'} exitosamente`);
					}}
					on:cancel={() => {
						shouldShowModal = false;
					}}
				/>
			{:else if modalType === 'DELETE'}
				<h3 class="font-bold text-lg">¿Seguro deseas eleminar {selectedProduct.nombre}?</h3>
				<p class="py-4">haz click en aceptar para eliminar el producto</p>
				<div class="modal-action">
					<button
						class="btn"
						on:click={() => {
							shouldShowModal = false;
						}}
					>
						Cancelar
					</button>
					<!-- if there is a button in form, it will close the modal -->
					<button
						class="btn btn-error"
						on:click={async () => {
							try {
								const docRef = doc(db, 'productos', selectedProduct.id);
								await deleteDoc(docRef);
								toast.success('Producto eliminado exitosamente');
								shouldShowModal = false;
								await fetchProducts();
							} catch (error) {
								toast.error('Hubo un error al eliminar el producto');
							}
						}}>Eliminar</button
					>
				</div>
			{/if}
		</div>
	</div>
	<div class="flex justify-end w-3/4 self-center mb-4">
		<button
			class="btn btn-success"
			on:click={() => {
				shouldShowModal = true;
				modalType = 'CREATE';
			}}
		>
			Crear Producto
		</button>
	</div>
	<div class="overflow-x-auto w-full flex justify-center">
		<table class="table w-3/4">
			<!-- head -->
			<thead>
				<tr>
					<th>Producto</th>
					<th>Descripcion</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each products as producto}
					<tr>
						<td>
							<div class="flex items-center space-x-3">
								<div class="avatar">
									<div class="mask mask-squircle w-20 h-20">
										<img src={producto.imageSRC} alt={producto.nombre} />
									</div>
								</div>
								<div>
									<div class="text-2xl font-bold">{producto.nombre}</div>
									<div class="text-lg opacity-50">L {producto.precio}</div>
								</div>
							</div>
						</td>
						<td>
							{producto.descripcion || '-'}
						</td>
						<th>
							<button
								class="btn btn-warning"
								on:click={() => {
									modalType = 'EDIT';
									selectedProduct = producto;
									shouldShowModal = true;
								}}
							>
								<iconify-icon icon="mdi:edit" />
							</button>
							<button
								class="btn btn-error"
								on:click={() => {
									modalType = 'DELETE';
									selectedProduct = producto;
									shouldShowModal = true;
								}}
							>
								<iconify-icon icon="mdi:trash" />
							</button>
						</th>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
