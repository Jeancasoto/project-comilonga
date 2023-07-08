<script>
	import { addDoc, collection, updateDoc } from 'firebase/firestore';
	import { db, storage } from '$lib/firebase';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import * as yup from 'yup';
	import { onMount } from 'svelte';

	export let producto;

	const schema = yup.object().shape({
		nombre: yup.string().required('Por favor ingresar un nombre').ensure(),
		descripcion: yup.string().required('Por favor ingresar una descripcion').ensure(),
		imagen: yup
			.mixed()
			.notRequired()
			.test('required', 'Por favor seleccionar una imagen', (value) => {
				// Hacer el campo no requerido, si hay producto con imagen
				if (producto.imagen) return true;
				return value && value.size > 0 && value.name !== '';
			})
			.test('type', 'Solo los siguientes formatos son acceptados: .jpeg, .jpg o .png', (value) => {
				// No tomar en cuenta el tipo de archivo, si no hay archivo seleccionado
				if (value.size === 0 && value.name === '') return true;
				return value && (value.type === 'image/jpeg' || value.type === 'image/png');
			})
	});

	let errors = {};

	let uploadedImage = '';

	onMount(async () => {
		if (producto && producto.imagen) {
			const url = await getDownloadURL(ref(storage, producto?.imagen));
			uploadedImage = url;
		}
	});

	async function onSubmit(e) {
		try {
			// `abortEarly: false` to get all the errors

			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			await schema.validate(data, { abortEarly: false });
			if (producto) {
				// Falta agregar logica de editar
			} else {
				const collectionRef = collection(db, 'productos');
				const doc = await addDoc(collectionRef, { ...data, imagen: '' });
				const imagePath = `productos/${doc.id}/imagen.jpg`;
				const imgRef = ref(storage, imagePath);
				const info = await uploadBytes(imgRef, data['imagen']);
				updateDoc(doc, { imagen: imagePath });
			}
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				errors = extractErrors(error);
			}
		}
	}

	function extractErrors(err) {
		return err.inner.reduce((acc, err) => {
			return { ...acc, [err.path]: err.message };
		}, {});
	}
</script>

<div class="flex justify-center w-full">
	<form on:submit|preventDefault={onSubmit}>
		<div class="flex justify-center">
			<div class="avatar">
				<div class="w-32 rounded-full">
					<img src={uploadedImage} alt="Imagen del producto" />
				</div>
			</div>
		</div>
		<div class="form-control w-full max-w-xs">
			<label class="label" for="nombre">
				<span class="label-text font-bold">Nombre del producto</span>
			</label>
			<input
				value={producto?.nombre ?? ''}
				name="nombre"
				type="text"
				placeholder="Orden de tacos..."
				class="input input-bordered w-full max-w-xs"
			/>
			{#if errors.nombre}
				<label class="label" for="nombre">
					<span class="label-text-alt text-red-500">{errors.nombre}</span>
				</label>
			{/if}
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="descripcion">
				<span class="label-text font-bold">Descripcion del producto</span>
			</label>
			<textarea
				value={producto?.Descripcion ?? ''}
				name="descripcion"
				placeholder="Orden de tacos bañados en salsa..."
				class="textarea textarea-bordered"
			/>
			{#if errors.descripcion}
				<label class="label" for="descripcion">
					<span class="label-text-alt text-red-500">{errors.descripcion}</span>
				</label>
			{/if}
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="imagen">
				<span class="label-text font-bold">Imagen del producto</span>
			</label>
			<input
				name="imagen"
				type="file"
				accept="image/jpeg,image/png"
				class="file-input file-input-bordered w-full max-w-xs"
				on:change={(e) => {
					if (e.currentTarget.files.length > 0) {
						const file = e.currentTarget.files[0];
						uploadedImage = URL.createObjectURL(file);
					}
				}}
			/>
			{#if errors.imagen}
				<label class="label" for="imagen">
					<span class="label-text-alt text-red-500">{errors.imagen}</span>
				</label>
			{/if}
		</div>
		<div class="flex flex-row justify-between mt-4">
			<button type="button" class="btn btn-danger">Cancelar</button>
			<button type="submit" class="btn btn-success">{`${producto ? 'Editar' : 'Crear'}`}</button>
		</div>
	</form>
</div>
