<script>
	// @ts-nocheck
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { Bar } from 'svelte-chartjs';
	import toast from 'svelte-french-toast';
	import { fetchAllProducts, fetchAllCategories, fetchAllMessages } from '$lib/helpers/firebase';
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
	import dayjs from 'dayjs';
	let products = [];
	let categories = [];
	let mensajes = [];
	let mensajesParseados = [];
	let itemsFlatList = [];
	let screenSize;
	let selectedMonth = 1;
	let availableYears = [];

	function findProduct(id) {
		return products.find((product) => product.id === id);
	}

	function proccessMessages() {
		mensajesParseados = mensajes.map((m) => {
			const sentDate = dayjs(m.date);
			const year = sentDate.year();
			if (!availableYears.includes(year)) availableYears = [...availableYears, year];
			return {
				...m,
				date: sentDate,
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
		toast.success('Cargado correctamente');
	});

	$: data = {
		labels: products.map((prod) => {
			return prod.nombre;
		}),
		datasets: [
			{
				label: 'Total de productos enviados',
				data: products.map(() => {
					return Math.floor(Math.random() * 100) + 1;
				})
			}
		]
	};
	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
</script>

<svelte:window bind:innerWidth={screenSize} />
<label for="months">Select a Month:</label>
<select id="months" bind:value={selectedMonth}>
	{#each Array.from({ length: 12 }, (_, i) => i + 1) as month}
		<option value={month}
			>{new Date(2023, month - 1, 1).toLocaleString('default', { month: 'long' })}</option
		>
	{/each}
</select>
<Bar
	{data}
	options={{
		responsive: true,
		scales: {
			x: {
				ticks: {
					display: screenSize > 800 //this will remove only the label
				}
			}
		}
	}}
/>
