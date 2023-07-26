<script>
	import { auth } from '$lib/firebase';
	import { auth as AuthStore } from '$lib/stores/auth';
	import { extractErrors } from '$lib/helpers/general';
	import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
	import { onMount } from 'svelte';
	import * as yup from 'yup';
	import { goto } from '$app/navigation';
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
			.ensure()
	});
	async function onSubmit(e) {
		try {
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);
			await schema.validate(data, { abortEarly: false });
			await sendPasswordResetEmail(auth, data.email.toString());
			goto('/admin/login');
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				errors = extractErrors(error);
			}
		}
	}
</script>

<div class="w-full flex justify-center bg-base-content">
	<div class="relative flex flex-col justify-center h-screen overflow-hidden">
		<div class="w-full p-6 m-auto rounded-md shadow-md lg:max-w-lg bg-base-100">
			<h1 class="text-3xl font-semibold text-center text-content">
				Por favor ingrese un correo electronico
			</h1>
			<form class="space-y-4" on:submit|preventDefault={onSubmit}>
				<div>
					<label class="label" for="email">
						<span class="text-base label-text">Email</span>
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
				<div class="flex justify-center">
					<button class="btn btn-primary" type="submit">Enviar</button>
				</div>
			</form>
		</div>
	</div>
</div>
