<script>
	import { db, storage } from '$lib/firebase';
	import { getDocs, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
	import { ref, uploadBytes } from 'firebase/storage';
	import { getFileDownloadURL } from '$lib/helpers/firebase';

	import { getGenerals } from '$lib/helpers/admin_helper';

	let quienes_somos = '';
	export let nuestra_mision = '';
	let nuestra_vision = '';

	let facebook_link = "";
	let instagram_link = "";
	let whatsapp_link = "";
	
	let logo_url = '';

	let error_saving = false;
	let success_saving = false;

	let uploadedImage = '';
	let file_to_upload ;


    // i guess de esta forma puedo llamar la funcion al solo cargar la pagina
    // $: loadData()
    $: {
        loadData()
		getFileDownloadURL('generales/4ttiLnXHzZOSrpGqSUYN/logo.jpg').then((url) => {
				uploadedImage = url;
				console.log(url)
			});
    }
	const handle_close_alert = () => {
		error_saving = false;
		success_saving = false;
	};

    const loadData = () =>{

        getGenerals().then((result) => {
        
            quienes_somos = result.quienes_somos;
            nuestra_mision = result.nuestra_mision;
            nuestra_vision = result.nuestra_vision;

            facebook_link = result.redes_sociales.facebook_link
            instagram_link = result.redes_sociales.instagram_link
            whatsapp_link = result.redes_sociales.whatsapp_link

			// logo_path = result.logo_path

        })
    }


	const handle_form_submit = async () => {
		try {
			// Guardando en firebase al guardar el formulario de generales
			const docRef = await addDoc(collection(db, 'generales'), {
				quienes_somos: quienes_somos,
				nuestra_mision: nuestra_mision,
				nuestra_vision: nuestra_vision,
				imagen: '',

				redes_sociales: {
					facebook_link: (facebook_link)!=null?facebook_link:'',
					instagram_link: (instagram_link)!=null?instagram_link:'',
					whatsapp_link: (whatsapp_link)!=null?whatsapp_link:'',
					
				}
			});
			logo_url = `generales/${docRef.id}/logo.jpg`

			const imgRef = ref(storage, logo_url);
			const info = await uploadBytes(imgRef, file_to_upload);

			await updateDoc(docRef, { imagen: logo_url });

		} catch (error) {
			console.log(error)
			error_saving = true;
		} finally {
			if (!error_saving){

				success_saving = true;
			}
		}
	};
</script>

<head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
</head>

{#if error_saving}
	<div class="alert alert-error">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>Problemas al guardar, reporte al administrador del sistem</span>
	</div>
{/if}

{#if success_saving}
	<div class="alert alert-success">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>Guardado exitoso!</span>
		<button on:click={handle_close_alert} class="btn btn-sm">close</button>
	</div>
{/if}

<div class="form_container">
	<div class="form_section_container">
		<!-- LOGO -->
		<div class="avatar logo_container">
			<div class="w-38 rounded-full">
				<img
					src={uploadedImage}
					alt="Logo de la comilonga"
				/>
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
		</div>
	</div>

	<!-- QUIENES SOMOS -->
	<div class="form-control">
		<label for="quienes_somos" class="label">
			<span class="label-text">¿Quienes somos?</span>
		</label>
		<textarea
			bind:value={quienes_somos}
			class="textarea textarea-bordered textarea-lg h-24"
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
			class="textarea textarea-bordered textarea-lg h-24"
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
			class="textarea textarea-bordered textarea-lg h-24"
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
				<span>
					<i class="material-icons">facebook</i>
				</span>
				<input
					bind:value={facebook_link}
					type="text"
					placeholder="Link de su pagina de facebook"
					class="input input-bordered"
				/>
			</label>
		</div>

		<!-- INSTAGRAM -->
		<div class="form-control">
			<label for="" class="label">
				<span class="label-text">Instagram</span>
			</label>
			<label class="input-group">
				<span>
					<i class="material-icons">favorite</i>
				</span>
				<input
					bind:value={instagram_link}
					type="text"
					placeholder="Link de su pagina de instagram"
					class="input input-bordered"
				/>
			</label>
		</div>

		<!-- WHATTSAPP  -->
		<div class="form-control">
			<label for="" class="label">
				<span class="label-text">WhatsApp</span>
			</label>
			<label class="input-group">
				<span>
					<i class="material-icons">message</i>
				</span>
				<input
					bind:value={whatsapp_link}
					type="text"
					placeholder="Numero de WhatsApp"
					class="input input-bordered"
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
		justify-content: space-evenly;
	}

	.logo_container{
		max-height: 30%;
		max-width: 20%;
	}
</style>
