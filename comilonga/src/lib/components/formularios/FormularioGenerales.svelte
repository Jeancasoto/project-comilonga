<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	import { db, storage } from '$lib/firebase';
	import { doc, updateDoc } from 'firebase/firestore';
	import { ref, uploadBytes } from 'firebase/storage';

	import { extractErrors } from '$lib/helpers/general';
	import { getGeneralDocId } from '$lib/helpers/admin_helper';

	import 'iconify-icon';
	import * as yup from 'yup';
	import { getFileDownloadURL } from '$lib/helpers/admin_helper';

	const schema = yup.object().shape({
		quienes_somos: yup.string().required('Quienes somos es requerido').ensure(),
		nuestra_mision: yup.string().required('Nuestra mision es requerida').ensure(),
		nuestra_vision: yup.string().required('Nuestra vision es requerida').ensure(),
		facebook_link: yup.string().required('Link de Facebook es requerido').ensure(),
		instagram_link: yup.string().required('Link de Instagram es requerido').ensure(),
		whatsapp_link: yup.string().required('Numero de Whatsapp es requerido').ensure(),
		email_link: yup.string().required('El correo es requerido').ensure(),

		logo: yup
			.mixed()
			.notRequired()
			.test('required', 'Por favor seleccionar una imagen', (value) => {
				// Hacer el campo no requerido, si hay producto con imagen
				if (generals && generals.imagen) return true;
				return value && value.size > 0 && value.name !== '';
			})
			.test('type', 'Solo los siguientes formatos son acceptados: .jpeg, .jpg o .png', (value) => {
				// No tomar en cuenta el tipo de archivo, si no hay archivo seleccionado
				if (value.size === 0 && value.name === '') return true;
				console.log(value);
				return value && (value.type === 'image/jpeg' || value.type === 'image/png');
			})
	});
	export let generals;
	let errors = {};
	$: uploadedImage = generals?.imagen ?? '';

	let error_saving = false;
	let success_saving = false;
	let error_loading = false;

	let file_to_upload;
	let showModal = false;

	let generals_doc_id = generals.id;

	async function onSubmit(e) {
		try {
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			await schema.validate(data, { abortEarly: false });

			// Guardando en firebase al guardar el formulario de generales
			const docRef = doc(db, 'generales', generals.id);
			await updateDoc(docRef, {
				quienes_somos: data.quienes_somos || '',
				nuestra_mision: data.nuestra_mision || '',
				nuestra_vision: data.nuestra_vision || '',

				redes_sociales: {
					facebook_link: data.facebook_link || '',
					instagram_link: data.instagram_link || '',
					whatsapp_link: data.whatsapp_link || '',
					email_link: data.email_link || ''
				}
			});
			const logo_url = `generales/${generals.id}/logo.jpg`;
			// logo_url = `generales/${generals_doc_id}/logo.jpg`;

			// Esta parte hace update de la imagen en firebase storage
			if (file_to_upload != null) {
				const imgRef = ref(storage, logo_url);
				await uploadBytes(imgRef, data['logo']);
				const imagen = await getFileDownloadURL(logo_url);
				await updateDoc(docRef, { imagen });
			}
		} catch (error) {
			showModal = true;
			if (error instanceof yup.ValidationError) {
				errors = extractErrors(error);
			}
		} finally {
			if (!error_saving) {
				success_saving = true;
			}
			showModal = true;
		}
	}
</script>

<div>
	<!-- Modal de alerta error/success -->
	<modal id="my_modal_1" class="modal" class:modal-open={showModal}>
		<form method="dialog" class="modal-box">
			<h3 class="font-bold text-lg">Alerta!</h3>
			<p class="py-4">
				{#if success_saving}
					Guardado de datos exitoso!
				{/if}
				{#if error_saving}
					Error al guardar! Pongase en contacto con el administrador.
				{/if}
				{#if error_loading}
					Error al cargar los datos desde la base de datos! Pongase en contacto con el
					administrador.
				{/if}
			</p>
			<div class="modal-action">
				<!-- if there is a button in form, it will close the modal -->
				<button on:click={() => (showModal = false)} class="btn"> Close</button>
			</div>
		</form>
	</modal>

	<form class="form_container" on:submit|preventDefault={onSubmit}>
		<div class="flex flex-col justify-center items-center">
			<!-- LOGO -->
			<div class="avatar logo_container">
				<div class="w-38 rounded-full">
					<img src={uploadedImage} alt="Logo de la comilonga" />
				</div>
			</div>

			<div class="form-control w-full max-w-xs">
				<label for="logo" class="label">
					<span class="label-text">Cambiar logo</span>
				</label>
				<input
					name="logo"
					type="file"
					class="file-input file-input-bordered w-full max-w-xs"
					accept="image/jpeg,image/png"
					on:change={(e) => {
						if (e.currentTarget.files.length > 0) {
							const file = e.currentTarget.files[0];
							file_to_upload = file;
							uploadedImage = URL.createObjectURL(file);
						}
					}}
				/>
				{#if errors.logo}
					<label class="label" for="logo">
						<span class="label-text-alt text-red-500">{errors.logo}</span>
					</label>
				{/if}
			</div>
		</div>

		<!-- QUIENES SOMOS -->
		<div class="form-control">
			<label for="quienes_somos" class="label">
				<span class="label-text">¿Quienes somos?</span>
			</label>
			<textarea
				value={generals?.quienes_somos ?? ''}
				name="quienes_somos"
				class="textarea textarea-bordered textarea-lg h-24"
				placeholder="Somos una empresa dedicada a ..."
			/>
			{#if errors.quienes_somos}
				<label class="label" for="quienes_somos">
					<span class="label-text-alt text-red-500">{errors.quienes_somos}</span>
				</label>
			{/if}
		</div>

		<!-- MISION -->
		<div class="form-control">
			<label for="nuestra_mision" class="label">
				<span class="label-text">¿Nuestra misión?</span>
			</label>
			<textarea
				value={generals?.nuestra_mision ?? ''}
				name="nuestra_mision"
				class="textarea textarea-bordered textarea-lg h-24"
				placeholder="Nuestra misión ..."
			/>
			{#if errors.nuestra_mision}
				<label class="label" for="nuestra_mision">
					<span class="label-text-alt text-red-500">{errors.nuestra_mision}</span>
				</label>
			{/if}
		</div>

		<!-- VISION -->
		<div class="form-control">
			<label for="nuestra_vision" class="label">
				<span class="label-text">¿Nuestra Visión?</span>
			</label>
			<textarea
				value={generals?.nuestra_vision ?? ''}
				name="nuestra_vision"
				class="textarea textarea-bordered textarea-lg h-24"
				placeholder="Nuestra visión es ..."
			/>
			{#if errors.nuestra_vision}
				<label class="label" for="nuestra_vision">
					<span class="label-text-alt text-red-500">{errors.nuestra_vision}</span>
				</label>
			{/if}
		</div>

		<div class="flex flex-row flex-wrap items-center justify-between">
			<!-- FACEBOOK -->
			<div class="form-control">
				<label for="facebook_link" class="label">
					<span class="label-text">Facebook</span>
				</label>
				<label class="input-group">
					<span class="">
						<iconify-icon icon="mdi:facebook" class="text-2xl" />
					</span>
					<input
						value={generals?.redes_sociales?.facebook_link ?? ''}
						name="facebook_link"
						type="text"
						placeholder="Link de su pagina de facebook"
						class="input input-bordered"
					/>
				</label>
				{#if errors.facebook_link}
					<label class="label" for="facebook_link">
						<span class="label-text-alt text-red-500">{errors.facebook_link}</span>
					</label>
				{/if}
			</div>

			<!-- INSTAGRAM -->
			<div class="form-control">
				<label for="instagram_link" class="label">
					<span class="label-text">Instagram</span>
				</label>
				<label class="input-group">
					<span class="">
						<iconify-icon icon="mdi:instagram" class="text-2xl" />
					</span>
					<input
						value={generals?.redes_sociales?.instagram_link ?? ''}
						name="instagram_link"
						type="text"
						placeholder="Link de su pagina de instagram"
						class="input input-bordered"
					/>
				</label>
				{#if errors.instagram_link}
					<label class="label" for="instagram_link">
						<span class="label-text-alt text-red-500">{errors.instagram_link}</span>
					</label>
				{/if}
			</div>

			<!-- WHATTSAPP  -->
			<div class="form-control">
				<label for="whatsapp_link" class="label">
					<span class="label-text">WhatsApp</span>
				</label>
				<label class="input-group">
					<span class="">
						<iconify-icon icon="mdi:whatsapp" class="text-2xl" />
					</span>
					<input
						value={generals?.redes_sociales?.whatsapp_link ?? ''}
						name="whatsapp_link"
						type="text"
						placeholder="Numero de WhatsApp"
						class="input input-bordered"
					/>
				</label>
				{#if errors.whatsapp_link}
					<label class="label" for="whatsapp_link">
						<span class="label-text-alt text-red-500">{errors.whatsapp_link}</span>
					</label>
				{/if}
			</div>

			<!-- eMAIL  -->
			<div class="form-control">
				<label for="email_link" class="label">
					<span class="label-text">e-Mail</span>
				</label>
				<label class="input-group">
					<span class="">
						<iconify-icon icon="mdi:email" class="text-2xl" />
					</span>
					<input
						value={generals?.redes_sociales?.email_link ?? ''}
						name="email_link"
						type="text"
						placeholder="Correo electronico"
						class="input input-bordered"
					/>
				</label>
				{#if errors.whatsapp_link}
					<label class="label" for="email_link">
						<span class="label-text-alt text-red-500">{errors.email_link}</span>
					</label>
				{/if}
			</div>
		</div>
		<!-- Seccion de boton de guardar -->
		<div class="flex justify-center mt-4">
			<button type="submit" class="btn btn-success">Guardar</button>
		</div>
	</form>
</div>

<style>
	.form_container {
		max-height: inherit;
		padding: 2% 10%;
	}

	.logo_container {
		max-height: 30%;
		max-width: 20%;
	}

	.logo_container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
