<script>
	//@ts-nocheck

	import { auth } from '$lib/firebase';
	import { auth as AuthStore } from '$lib/stores/auth';

	import { generals } from '$lib/stores/generals';
	import { extractErrors } from '$lib/helpers/general';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { onMount } from 'svelte';

	import * as yup from 'yup';
	import { goto } from '$app/navigation';

	$: logoSRC = $generals['imagen'];

	onMount(() => {
		return AuthStore.subscribe((user) => {
			if (user !== null) {
				goto('/admin');
			}
		});
	});
	let errors = {};
	const schema = yup.object().shape({
		email: yup
			.string()
			.email('Por favor ingrese un correo valido')
			.required('Por favor ingrese su correo')
			.ensure(),
		pass: yup.string().required('Por favor ingrese su contraseña').ensure()
	});
	async function onSubmit(e) {
		try {
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			await schema.validate(data, { abortEarly: false });
			await signInWithEmailAndPassword(auth, data.email, data.pass);
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				errors = extractErrors(error);
			}
		}
	}
</script>

<div class="login-container">
	<div class="card card-compact w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="login-img">
				<img src={logoSRC} alt="Logo la comilonga" class="w-40 object-scale-down" />
			</div>

			<form class="space-y-4" on:submit|preventDefault={onSubmit}>
				<div>
					<label class="label" for="email">
						<span class="text-base label-text">Correo</span>
					</label>
					<input
						name="email"
						type="text"
						placeholder="juan@gmail.com"
						class="w-full input input-bordered"
					/>
					{#if errors.email}
						<label class="label" for="email">
							<span class="label-text-alt text-red-500">{errors.email}</span>
						</label>
					{/if}
				</div>
				<div>
					<label class="label" for="pass">
						<span class="text-base label-text">Contraseña</span>
					</label>
					<input
						name="pass"
						type="password"
						placeholder="******"
						class="w-full input input-bordered"
					/>
					{#if errors.pass}
						<label class="label" for="pass">
							<span class="label-text-alt text-red-500">{errors.pass}</span>
						</label>
					{/if}
				</div>
				<div class="flex justify-center flex-col items-center">
					<button class="btn btn-primary" type="submit">Acceder</button>
					<a class="link-secondary" href="/admin/forgot-password">Olvide mi contraseña</a>
				</div>
			</form>
		</div>
	</div>
</div>

<style>

	.login-container {
		display: flex;

		justify-content: center;
		align-items: center;

		width: 100vw;
		height: 100vh;

		background-color: #eeeafc;
	}

	.login-img {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
