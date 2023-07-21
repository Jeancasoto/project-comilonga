<script>
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { auth as authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	onMount(() => {
		onAuthStateChanged(auth, authStore.set);
	});
</script>

<div>
	{#if $authStore !== null}
		<button
			class="btn btn-warning"
			type="button"
			on:click={async () => {
				await signOut(auth);
				goto('/');
			}}
		>
			Salir
		</button>
	{/if}
	<slot />
</div>
