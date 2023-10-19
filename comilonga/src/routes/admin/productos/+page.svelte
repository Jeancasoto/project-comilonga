<script>
	// @ts-nocheck
	import { db } from '$lib/firebase';
	import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
	import { fetchAllCategories, fetchAllProducts } from '$lib/helpers/firebase';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import FormularioProductos from '$lib/components/formularios/FormularioProductos.svelte';
	import toast from 'svelte-french-toast';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	let products = [];
	let categories = [];
	let selectedProduct = {};
	let shouldShowModal = false;
	let modalType = '';

	let selectedCategory = '';
	let selectedCategoryName = '';

	onMount(async () => {
		if (auth.currentUser === null) {
			goto('/admin/login');
		}
		products = await fetchAllProducts();
		categories = await fetchAllCategories();
	});
</script>

<!-- Inicio codigo del modal -->

<div class="flex justify-center flex-col">
	<div class="modal" class:modal-open={shouldShowModal}>
		<div class="modal-box">
			{#if modalType === 'CREATE' || modalType === 'EDIT'}
				<FormularioProductos
					producto={modalType === 'EDIT' ? selectedProduct : undefined}
					categorias={categories}
					on:success={async () => {
						shouldShowModal = false;
						products = await fetchAllProducts();
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
								await updateDoc(docRef, { is_deleted: true });
								toast.success('Producto eliminado exitosamente');
								shouldShowModal = false;
								products = await fetchAllProducts();
							} catch (error) {
								toast.error('Hubo un error al eliminar el producto');
							}
						}}>Eliminar</button
					>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Fin codigo del modal -->

<h1 class="text-3xl font-bold text-center my-5">Tus productos</h1>

<div class="flex justify-center items-center mb-4">
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

<div class="menu_items_container">
	<div class="flex overflow-x-auto space-x-8 pt-2 pb-2">
		{#each categories as category}
			<button
				type="button"
				class="btn md:btn-md btn-sm btn-secondary flex-shrink-0 rounded-full"
				class:bg-primary-focus={category.id === selectedCategory}
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
					<h3 class="font-black text-gray-800 md:text-3xl text-xl">
						{producto.nombre}
					</h3>
					<p class="md:text-lg text-gray-500 text-base">
						{producto.descripcion}
					</p>
					<p class="text-xl text-gray-500 font-black text-gray-800">L.{producto.precio}</p>
				</div>

				<div class="cart_button">
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
						class="btn btn-info"
						on:click={() => {
							const docRef = doc(db, 'productos', producto.id);
							updateDoc(docRef, { is_visible: !producto.is_visible });
							producto.is_visible = !producto.is_visible;
						}}
					>
						<iconify-icon icon={producto.is_visible ? 'mdi:eye' : 'mdi:eye-off'} />
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
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	.item_info {
		display: flex;
		flex-direction: row;

		overflow: hidden;
	}
	.buttons {
		display: flex;
		flex-direction: row;
	}

	.menu_items_container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		padding: 5px 35px;
	}

	.cart_button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		justify-self: flex-end;
	}
</style>
