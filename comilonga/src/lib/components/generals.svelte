<script>
	import { db, storage } from '$lib/firebase';
	import { getDocs, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
	import { ref, uploadBytes } from 'firebase/storage';

	import { logo } from '$lib/store';

	import { getFileDownloadURL, getGenerals, getGeneralDocId } from '$lib/helpers/firebase';

	import { onMount } from 'svelte';

	let quienes_somos = '';
	export let nuestra_mision = '';
	let nuestra_vision = '';

	let facebook_link = '';
	let instagram_link = '';
	let whatsapp_link = '';

	let error_saving = false;
	let success_saving = false;
	let error_loading = false;

	let uploadedImage = '';
	let file_to_upload;
	let logo_url;

	let generals_doc_id = '';

	let showModal = false;

	// i guess de esta forma puedo llamar la funcion al solo cargar la pagina
	// $:{
	// 	loadData()
	// }
	async function fetchData(){
		try {
			await getGeneralDocId().then((docId) => {
				generals_doc_id = docId;
				console.log(docId);
				console.log(generals_doc_id);
				getFileDownloadURL(`generales/${docId}/logo.jpg`).then((url) => {
					uploadedImage = url;
					logo.set(url);
					loadData();
				});
			});
		} catch (error) {
			console.log(error);
			error_loading = true;
		}
	}

	onMount(async () => {
		await fetchData();
	});

	const handle_close_alert = () => {
		error_saving = false;
		success_saving = false;
	};

	const loadData = () => {
		getGenerals(generals_doc_id).then((result) => {
			console.log(result);
			quienes_somos = result.quienes_somos;
			nuestra_mision = result.nuestra_mision;
			nuestra_vision = result.nuestra_vision;

			facebook_link = result.redes_sociales.facebook_link;
			instagram_link = result.redes_sociales.instagram_link;
			whatsapp_link = result.redes_sociales.whatsapp_link;
		});
	};

	const handle_form_submit = async () => {
		try {
			// Guardando en firebase al guardar el formulario de generales
			const docRef = await updateDoc(doc(db, 'generales', generals_doc_id), {
				quienes_somos: quienes_somos != null ? quienes_somos : '',
				nuestra_mision: nuestra_mision != null ? nuestra_mision : '',
				nuestra_vision: nuestra_vision != null ? nuestra_vision : '',

				redes_sociales: {
					facebook_link: facebook_link != null ? facebook_link : '',
					instagram_link: instagram_link != null ? instagram_link : '',
					whatsapp_link: whatsapp_link != null ? whatsapp_link : ''
				}
			});
			// logo_url = `generales/${docRef.id}/logo.jpg`;
			logo_url = `generales/${generals_doc_id}/logo.jpg`;

			// Esta parte hace update de la imagen en firebase storage
			if (file_to_upload != null) {
				const imgRef = ref(storage, logo_url);
				const info = await uploadBytes(imgRef, file_to_upload);
				console.log(file_to_upload);
			}
			// await updateDoc(docRef, { imagen: logo_url });
		} catch (error) {
			console.log(error);
			error_saving = true;
			showModal = true;
		} finally {
			if (!error_saving) {
				success_saving = true;
			}
			showModal = true;
		}
	};
</script>

<head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
</head>

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
				Error al cargar los datos desde la base de datos! Pongase en contacto con el administrador.
			{/if}
		</p>
		<div class="modal-action">
			<!-- if there is a button in form, it will close the modal -->
			<button on:click={() => (showModal = false)} class="btn"> Close</button>
		</div>
	</form>
</modal>

<div class="form_container">
	<div class="form_section_container">
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
				class="file-input file-input-bordered w-full max-w-xs boxes_background"
				accept="image/jpeg,image/png"
				on:change={(e) => {
					if (e.currentTarget.files.length > 0) {
						const file = e.currentTarget.files[0];
						file_to_upload = file;
						uploadedImage = URL.createObjectURL(file);
					}
				}}
			/>
		</div>
	</div>

	<!-- QUIENES SOMOS -->
	<div class="form-control">
		<label for="quienes_somos" class="label">
			<span class="label-text">¿Quienes somos?</span>
		</label>
		<textarea
			bind:value={quienes_somos}
			class="textarea textarea-bordered textarea-lg h-24 boxes_background"
			placeholder="Somos una empresa dedicada a ..."
		/>
		<label for="" class="label" />
	</div>

	<!-- MISION -->
	<div class="form-control">
		<label for="nuestra_mision" class="label">
			<span class="label-text">¿Nuestra misión?</span>
		</label>
		<textarea
			bind:value={nuestra_mision}
			class="textarea textarea-bordered textarea-lg h-24 boxes_background"
			placeholder="Nuestra misión ..."
		/>
		<label for="" class="label" />
	</div>

	<!-- VISION -->
	<div class="form-control">
		<label for="nuestra_vision" class="label">
			<span class="label-text">¿Nuestra Visión?</span>
		</label>
		<textarea
			bind:value={nuestra_vision}
			class="textarea textarea-bordered textarea-lg h-24 boxes_background"
			placeholder="Nuestra visión es ..."
		/>
		<label for="" class="label" />
	</div>

	<div class="contact_form_section">
		<!-- FACEBOOK -->
		<div class="form-control">
			<label for="" class="label">
				<span class="label-text">Facebook</span>
			</label>
			<label class="input-group">
				<span class="boxes_background">
					<i class="material-icons">facebook</i>
				</span>
				<input
					bind:value={facebook_link}
					type="text"
					placeholder="Link de su pagina de facebook"
					class="input input-bordered boxes_background"
				/>
			</label>
		</div>

		<!-- INSTAGRAM -->
		<div class="form-control">
			<label for="" class="label">
				<span class="label-text">Instagram</span>
			</label>
			<label class="input-group">
				<span class="boxes_background">
					<i class="material-icons boxes_backgrounds">favorite</i>
				</span>
				<input
					bind:value={instagram_link}
					type="text"
					placeholder="Link de su pagina de instagram"
					class="input input-bordered boxes_background"
				/>
			</label>
		</div>

		<!-- WHATTSAPP  -->
		<div class="form-control">
			<label for="" class="label">
				<span class="label-text">WhatsApp</span>
			</label>
			<label class="input-group">
				<span class="boxes_background">
					<i class="material-icons">message</i>
				</span>
				<input
					bind:value={whatsapp_link}
					type="text"
					placeholder="Numero de WhatsApp"
					class="input input-bordered boxes_background"
				/>
			</label>
		</div>
	</div>
	<!-- Seccion de boton de guardar -->
	<div class="form_section_savebutton">
		<button on:click={handle_form_submit} class="btn btn-success">Guardar</button>
	</div>
</div>

<!-- STYLE SECTION -->
<style>
	.form_container {
		max-height: inherit;
		padding: 5% 10%;
	}
	.form_section_container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.form_section_savebutton {
		display: flex;
		justify-content: center;

		margin: 50px;
	}

	.contact_form_section {
		display: flex;
		flex-direction: row;

		align-items: center;
		justify-content: space-between;

		flex-wrap: wrap;
	}

	.logo_container {
		max-height: 30%;
		max-width: 20%;
	}

	.boxes_background {
		background-color: #ffffff;
	}
</style>
