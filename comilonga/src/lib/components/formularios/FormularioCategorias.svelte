<script>
	// @ts-nocheck

	import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { getFileDownloadURL } from '$lib/helpers/firebase';
	import * as yup from 'yup';
	import { createEventDispatcher } from 'svelte';
	import { extractErrors } from '$lib/helpers/general';

	export let categoria;
	let uploadedImage = '';
	let errors = {};

	$: {
		if (categoria && categoria.imagen) {
			getFileDownloadURL(categoria?.imagen).then((url) => {
				uploadedImage = url;
			});
		}
		uploadedImage = '';
	}

	const dispatch = createEventDispatcher();

	const schema = yup.object().shape({
		nombre: yup.string().required('Por favor ingresar un nombre').ensure()
	});

	async function onSubmit(e) {
		try {
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			await schema.validate(data, { abortEarly: false });
			if (categoria) {
				const docRef = doc(db, 'categorias', categoria.id);
				const info = await updateDoc(docRef, data);
				dispatch('success', info);
			} else {
				const collectionRef = collection(db, 'categorias');
				const docRef = await addDoc(collectionRef, {
					...data,
					is_visible: true,
					is_deleted: false
				});
				const doc = await getDoc(docRef);
				dispatch('success', { id: doc.id, ...doc.data() });
			}
			uploadedImage = '';
			e.target.reset();
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				errors = extractErrors(error);
			}
		}
	}
</script>

<div class="flex justify-center w-full">
	<form on:submit|preventDefault={onSubmit}>
		<div class="form-control w-full max-w-xs">
			<label class="label" for="nombre">
				<span class="label-text font-bold">Nombre de la categoria</span>
			</label>
			<input
				value={categoria?.nombre ?? ''}
				name="nombre"
				type="text"
				placeholder="Bebidas, Tacos..."
				class="input input-bordered w-full max-w-xs"
			/>
			{#if errors.nombre}
				<label class="label" for="nombre">
					<span class="label-text-alt text-red-500">{errors.nombre}</span>
				</label>
			{/if}
		</div>

		<div class="flex flex-row justify-between mt-4">
			<button
				type="button"
				class="btn btn-danger"
				on:click={() => {
					dispatch('cancel');
					uploadedImage = '';
				}}>Cancelar</button
			>
			<button type="submit" class="btn btn-success">{`${categoria ? 'Editar' : 'Crear'}`}</button>
		</div>
	</form>
</div>
