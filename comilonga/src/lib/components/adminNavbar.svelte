<script>
	// @ts-nocheck
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { auth as authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { generals } from '$lib/stores/generals';

	import 'iconify-icon';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	onMount(() => {
		onAuthStateChanged(auth, authStore.set);
	});

	$: logoSRC = $generals['imagen'];
</script>

{#if $authStore !== null}
	<div class="navbar bg-base-100">
		<!-- <div class="rounded-full">
			<a href="/cliente/acerca">
				<img src={logoSRC} alt="Logo la comilonga" class="w-20 object-scale-down" />
			</a>
		</div> -->
		<div class="flex-1 ml-4">
			<h2 class="font-bold normal-case text-xl">Admin La Comilonga</h2>
		</div>

		<div class="global_menu_container">
			<div class="options_container">
				<a class="btn btn-outline btn-secondary" href="/admin" class:active={$page.url.pathname === '/admin'}
					>Generales</a
				>
				<div class="divider divider-horizontal" />
				<a
					class="btn btn-outline btn-primary"
					href="/admin/productos"
					class:active={$page.url.pathname === '/admin/productos'}>Productos</a
				>
			</div>
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
	</div>
{:else}
	<slot />
{/if}

<style>
	.navbar {
		background-color: rgb(255, 255, 255);
		z-index: 1;
		border-width: 4px;
	}

	.global_menu_container {
		display: flex;
		width: 100%;

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
