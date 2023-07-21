<script>
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { auth as authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import 'iconify-icon';
	import { page } from '$app/stores';
	onMount(() => {
		onAuthStateChanged(auth, authStore.set);
	});
</script>

<div>
	<div class="drawer drawer-mobile">
		<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col items-center justify-center">
			<label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
			<slot />
		</div>
		<div class="drawer-side bg-base-900">
			<label for="my-drawer-2" class="drawer-overlay" />
			<ul class="menu rounded-box p-4 overflow-y-auto w-80 text-base-content">
				<!-- Sidebar content here -->
				<li>
					<a href="/admin" class:active={$page.url.pathname === '/admin'} class="text-xl">
						<iconify-icon icon="mdi:home" />
						Generales
					</a>
				</li>
				<li>
					<a
						href="/admin/productos"
						class:active={$page.url.pathname === '/admin/productos'}
						class="text-xl"
					>
						<iconify-icon icon="mdi:shopping" />
						Productos
					</a>
				</li>
			</ul>
			<ul class="menu flex justify-end">
				<li class="text-xl hover:bg-error">
					<button
						on:click={async () => {
							await signOut(auth);
						}}
					>
						<iconify-icon icon="mdi:logout" />Salir</button
					>
				</li>
			</ul>
		</div>
	</div>
</div>
