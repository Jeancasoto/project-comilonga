<script>
	// @ts-nocheck
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { Bar } from 'svelte-chartjs';
	import toast from 'svelte-french-toast';
	import { fetchAllProducts, fetchAllCategories, fetchAllMessages } from '$lib/helpers/firebase';
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
	let products = [];
	let categories = [];
	let mensajes = [];
	let mensajesParseados = [];
	let itemsFlatList = [];

	function findProduct(id) {
		return products.find((product) => product.id === id);
	}

	function proccessMessages() {
		mensajesParseados = mensajes.map((m) => {
			return {
				...m,
				items: m.items.map((i) => findProduct(i.id))
			};
		});
	}

	function createFlatList() {
		itemsFlatList = mensajesParseados.reduce((acc, m) => {
			return [...acc, ...m.items];
		}, []);
	}

	onMount(async () => {
		mensajes = await fetchAllMessages();
		products = await fetchAllProducts();
		categories = await fetchAllCategories();
		proccessMessages();
		createFlatList();
		console.log(mensajesParseados);
		toast.success('Cargado correctamente');
	});

	$: data = {
		labels: products.map((prod) => {
			return prod.nombre;
		}),
		datasets: [
			{
				label: '% of Votes',
				data: products.map(() => {
					return Math.floor(Math.random() * 100) + 1;
				})
			}
		]
	};
	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
</script>

<Bar {data} options={{ responsive: true }} />
