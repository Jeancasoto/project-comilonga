<script>
	// @ts-nocheck
	import { db } from '$lib/firebase';
	import { collectionGroup, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import FormularioCategorias from '$lib/components/formularios/FormularioCategorias.svelte';
	let categories = [];
	let selectedCategory = {};
	let shouldShowModal = false;
	let modalType = '';

	async function fetchCategorias() {
		const collectionRef = collectionGroup(db, 'categorias');
		console.log('wenas');
		const querySnap = await getDocs(collectionRef);
		categories = querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		console.log(categories);
	}

	onMount(async () => {
		if (auth.currentUser === null) {
			goto('/admin/login');
		}
		await fetchCategorias();
	});
</script>

<!-- Inicio codigo del modal -->

<div class="flex justify-center flex-col">
	<div class="modal" class:modal-open={shouldShowModal}>
		<div class="modal-box">
			{#if modalType === 'CREATE' || modalType === 'EDIT'}
				<FormularioCategorias
					categoria={modalType === 'EDIT' ? selectedCategory : undefined}
					on:success={async () => {
						console.log('success');
						shouldShowModal = false;
						await fetchCategorias();
						toast.success(`Categoria ${modalType === 'EDIT' ? 'editada' : 'creada'} exitosamente`);
					}}
					on:cancel={() => {
						shouldShowModal = false;
					}}
				/>
			{:else if modalType === 'DELETE'}
				<h3 class="font-bold text-lg">¿Seguro deseas eleminar {selectedCategory.nombre}?</h3>
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
								const docRef = doc(db, 'categorias', selectedCategory.id);
								await deleteDoc(docRef);
								await fetchCategorias();
								shouldShowModal = false;
								toast.success('Categoria eliminada exitosamente');
							} catch (error) {
								toast.error('Hubo un error al eliminar la categoria');
							}
						}}>Eliminar</button
					>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Fin codigo del modal -->

<h1 class="text-3xl font-bold text-center my-5">Tus Categorias</h1>
<div class="flex justify-center items-center mb-4">
	<button
		class="btn btn-success"
		on:click={() => {
			shouldShowModal = true;
			modalType = 'CREATE';
		}}
	>
		Crear Categoria
	</button>
</div>
<div class="flex flex-col justify-center items-center w-full">
	<div>
	{#each categories as producto}

		<div class="flex w-full">
			<div class="grid p-5 h-20 text-wrap text-2xl justify-start font-bold break-all w-full flex-grow card  rounded-box place-items-center">
					{producto.nombre}
			</div>

			
			<div class="flex flex-row text-wrap h-20 w-full flex-grow card rounded-box place-items-center">
				<button
					class="btn btn-warning"
					on:click={() => {
						modalType = 'EDIT';
						selectedCategory = producto;
						shouldShowModal = true;
					}}
				>
					<iconify-icon icon="mdi:edit" />
				</button>
				<button
					class="btn btn-info"
					on:click={() => {
						const docRef = doc(db, 'categorias', producto.id);
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
						selectedCategory = producto;
						shouldShowModal = true;
					}}
				>
					<iconify-icon icon="mdi:trash" />
				</button>
			</div>
		</div>
	{/each}
</div>

</div>

<style>
	.global-container {
		display: flex;

		align-items: center;
		justify-content: center;

		width: 100vw;
		height: 100%;
	}

	.inner_container {
		width: 50%;
		height: 50%;
	}
	.boton-crear-prod {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		margin: 10px 50px;
	}

	.table_desc {
		overflow: hidden;
	}
</style>
