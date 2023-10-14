<script>
	// @ts-nocheck
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { generals } from '$lib/stores/generals';
	import { onMount } from 'svelte';

	import 'iconify-icon';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: logoSRC = $generals['imagen'];
	let isLoggedIn = false;
	onMount(() => {
		return auth.onAuthStateChanged((user) => {
			isLoggedIn = user !== null;
		});
	});
</script>

<div class="navbar bg-base-100 w-screen overflow-scroll">
	<div class="rounded-full">
		<a href="/acerca">
			<img src={logoSRC} alt="Logo la comilonga" class="w-20 object-scale-down" />
		</a>
	</div>
	{#if isLoggedIn}
		<div class="flex flex-row">
			<a
				class="btn btn-sm btn-secondary"
				href="/admin"
				class:active={$page.url.pathname === '/admin'}>Generales</a
			>
			<div class="divider divider-horizontal" />
			<a
				class="btn btn-sm btn-primary"
				href="/admin/productos"
				class:active={$page.url.pathname === '/admin/productos'}>Productos</a
			>
			<div class="divider divider-horizontal" />
			<a
				class="btn btn-sm btn-primary"
				href="/admin/categorias"
				class:active={$page.url.pathname === '/admin/categorias'}>Categorias</a
			>
		</div>
		<div class="signout_button">
			<button
				class="btn btn-secondary"
				on:click={async () => {
					await signOut(auth);
					goto('/admin/login');
				}}
			>
				<iconify-icon icon="mdi:logout" /></button
			>
		</div>
	{/if}
</div>

<style>
	.navbar {
		background-color: rgb(255, 255, 255);
		z-index: 1;
		border-width: 4px;
	}

	.global_menu_container {
		display: flex;

		height: 50%;

		padding: 0% 2.5%;
	}

	.options_container {
		display: flex;

		width: 60%;
		/* height: 50vh; */
		align-items: center;

		justify-content: flex-start;
	}

	.signout_button {
		display: flex;

		width: 40%;
		/* height: 50vh; */
		align-items: center;

		justify-content: flex-end;
	}
</style>
