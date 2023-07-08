<script>
	import { db } from '$lib/firebase';
	import FormularioProductos from '$lib/components/FormularioProductos.svelte';
	import { collectionGroup, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	let producto = {};
	onMount(async () => {
		const testCollection = collectionGroup(db, 'productos');
		const docs = await getDocs(testCollection);
		const mappedDocs = docs.docs.map((t) => t.data());
		const first = mappedDocs[0];
		producto = { id: docs.docs[0].id, ...first };
	});
	let isAgregar = true;
</script>

<div class="flex justify-center items-center flex-col">
	<h1>Pagina principal</h1>
</div>
