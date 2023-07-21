<script>
	import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
	import { db, storage } from '$lib/firebase';
	import { getFileDownloadURL } from '$lib/helpers/firebase';
	import { ref, uploadBytes } from 'firebase/storage';
	import * as yup from 'yup';
	import { createEventDispatcher } from 'svelte';
	import { extractErrors } from '$lib/helpers/general';

	export let producto;
	let uploadedImage = '';
	let errors = {};

	$: {
		if (producto && producto.imagen) {
			getFileDownloadURL(producto?.imagen).then((url) => {
				uploadedImage = url;
			});
		}
	}

	const dispatch = createEventDispatcher();

	const schema = yup.object().shape({
		nombre: yup.string().required('Por favor ingresar un nombre').ensure(),
		descripcion: yup.string().required('Por favor ingresar una descripcion').ensure(),
		precio: yup
			.number()
			.transform((value) => parseFloat(value))
			.positive('El precio debe ser una cifra positiva')
			.required('Por favor ingresar un precio'),
		imagen: yup
			.mixed()
			.notRequired()
			.test('required', 'Por favor seleccionar una imagen', (value) => {
				// Hacer el campo no requerido, si hay producto con imagen
				if (producto && producto.imagen) return true;
				return value && value.size > 0 && value.name !== '';
			})
			.test('type', 'Solo los siguientes formatos son acceptados: .jpeg, .jpg o .png', (value) => {
				// No tomar en cuenta el tipo de archivo, si no hay archivo seleccionado
				if (value.size === 0 && value.name === '') return true;
				return value && (value.type === 'image/jpeg' || value.type === 'image/png');
			})
	});

	async function onSubmit(e) {
		try {
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			await schema.validate(data, { abortEarly: false });
			if (producto) {
				// Falta agregar logica de editar
				const docRef = doc(db, 'productos', producto.id);
				if (data.imagen.size !== 0) {
					const imagePath = `productos/${docRef.id}/imagen.jpg`;
					const imgRef = ref(storage, imagePath);
					const info = await uploadBytes(imgRef, data['imagen']);
					data['imagen'] = imagePath;
				} else {
					delete data['imagen'];
				}
				const info = await updateDoc(docRef, data);
				dispatch('success', info);
			} else {
				const collectionRef = collection(db, 'productos');
				const doc = await addDoc(collectionRef, { ...data, imagen: '' });
				const imagePath = `productos/${doc.id}/imagen.jpg`;
				const imgRef = ref(storage, imagePath);
				await uploadBytes(imgRef, data['imagen']);
				const info = await updateDoc(doc, { imagen: imagePath });
				dispatch('success', info);
			}
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				errors = extractErrors(error);
			}
		}
	}
</script>

<div class="flex justify-center w-full">
	<form on:submit|preventDefault={onSubmit}>
		{#if uploadedImage !== ''}
			<div class="flex justify-center">
				<div class="avatar">
					<div class="w-32 rounded-full">
						<img src={uploadedImage} alt="Imagen del producto" />
					</div>
				</div>
			</div>
		{/if}
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
			<label class="label" for="precio">
				<span class="label-text font-bold">Precio del producto</span>
			</label>
			<input
				value={producto?.precio ?? ''}
				name="precio"
				type="text"
				placeholder="50.00..."
				class="input input-bordered w-full max-w-xs"
				on:change={(e) => {
					let newNumber = Number(e.currentTarget.value.toString());
					if (isNaN(newNumber)) {
						newNumber = 0;
					}
					e.currentTarget.value = newNumber.toFixed(2);
				}}
			/>
			{#if errors.precio}
				<label class="label" for="precio">
					<span class="label-text-alt text-red-500">{errors.precio}</span>
				</label>
			{/if}
		</div>
		<div class="form-control w-full max-w-xs">
			<label class="label" for="descripcion">
				<span class="label-text font-bold">Descripcion del producto</span>
			</label>
			<textarea
				value={producto?.descripcion ?? ''}
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
			<button
				type="button"
				class="btn btn-danger"
				on:click={() => {
					dispatch('cancel');
					uploadedImage = '';
				}}>Cancelar</button
			>
			<button type="submit" class="btn btn-success">{`${producto ? 'Editar' : 'Crear'}`}</button>
		</div>
	</form>
</div>
