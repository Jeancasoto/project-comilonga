<script>
	import { db, storage } from '$lib/firebase';
	import { getDocs, addDoc, collection, doc, updateDoc } from 'firebase/firestore';

	import { getGenerals } from '$lib/helpers/admin_helper';

	import { bool } from 'yup';

	let quienes_somos = '';
	export let nuestra_mision = '';
	let nuestra_vision = '';

	let facebook_link = '';
	let instagram_link = '';
	let whatsapp_link = '';

	let error_saving = false;
	let success_saving = false;

    // i guess de esta forma puedo llamar la funcion al solo cargar la pagina
    // $: loadData()
    $: {
        loadData()
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

            facebook_link = result.facebook_link
            instagram_link = result.instagram_link
            whatsapp_link = result.whatsapp_link

            console.log(quienes_somos)
        })
    }


	const handle_form_submit = async () => {
		try {
			// Guardando en firebase al guardar el formulario de generales
			const docRef = await addDoc(collection(db, 'generales'), {
				quienes_somos: quienes_somos,
				nuestra_mision: nuestra_mision,
				nuestra_vision: nuestra_vision,

				redes_sociales: {
					facebook: facebook_link,
					instagram: instagram_link,
					whatsapp: whatsapp_link
				}
			});
			console.log('tuanis guardando');
		} catch (error) {
			error_saving = true;
			console.log('Error guardando');
		} finally {
			success_saving = true;
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
		<div class="avatar">
			<div class="w-38 rounded-full">
				<img
					src="data:image/png;base64,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"
					alt="Logo de la comilonga"
				/>
			</div>
		</div>

		<div class="form-control w-full max-w-xs">
			<label for="logo" class="label">
				<span class="label-text">Cambiar logo</span>
			</label>
			<input name="logo" type="file" class="file-input file-input-bordered w-full max-w-xs" />
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
</style>
