<script>
	// @ts-nocheck
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { Bar, Pie } from 'svelte-chartjs';
	import { fetchAllCategories, fetchAllMessages, fetchAllProducts } from '$lib/helpers/firebase';
	import {
		Chart,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
		ArcElement
	} from 'chart.js';
	import dayjs from 'dayjs';
	let products = [];
	let categories = [];
	let mensajes = [];
	let mensajesParseados = [];
	let itemsFlatList = [];
	let screenSize;
	let selectedMonth = dayjs().month() + 1;
	let selectedYear = -1;
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
				items: m.items.map((i) => ({ ...findProduct(i.id), quantity: i.quantity }))
			};
		});
		if (availableYears.length > 0) {
			const currentYear = dayjs().year();
			if (availableYears.includes(currentYear)) {
				selectedYear = currentYear;
			}
		}
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
	});

	$: histogramData = {
		labels: products.map((prod) => {
			return prod.nombre;
		}),
		datasets: [
			{
				label: 'Total de productos enviados',
				backgroundColor: ['#D15454'],
				data: products.map((prod) => {
					return mensajesParseados.reduce((acc, curr) => {
						if (curr.date.year() === selectedYear && curr.date.month() + 1 === selectedMonth) {
							const lookup = curr.items.find((v) => v.id === prod.id);
							if (lookup !== undefined) {
								return acc + lookup.quantity;
							}
						}
						return acc;
					}, 0);
				})
			}
		]
	};

	$: pedidosData = {
		labels: ['llevar', 'local'],
		datasets: [
			{
				label: 'Total de tipos pedidos',
				backgroundColor: ['#D15454', '#48ACAC'],
				data: ['llevar', 'local'].map((tipo) => {
					return mensajesParseados.reduce((acc, curr) => {
						if (
							curr.date.year() === selectedYear &&
							curr.date.month() + 1 === selectedMonth &&
							curr.tipoDePedido === tipo
						) {
							return acc + 1;
						}
						return acc;
					}, 0);
				})
			}
		]
	};

	$: pagoData = {
		labels: ['tarjeta', 'efectivo'],
		datasets: [
			{
				label: 'Total tipo de pago',
				backgroundColor: ['#48ACAC', '#D15454'],
				data: ['efectivo', 'tarjeta'].map((tipo) => {
					return mensajesParseados.reduce((acc, curr) => {
						if (
							curr.date.year() === selectedYear &&
							curr.date.month() + 1 === selectedMonth &&
							curr.tipoDePago === tipo
						) {
							return acc + 1;
						}
						return acc;
					}, 0);
				})
			}
		]
	};

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
	Chart.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

<svelte:window bind:innerWidth={screenSize} />
<div class="p-4">
	<div class="w-full flex justify-center items-center">
		<h1 class="text-2xl font-bold">Historial de los pedidos</h1>
	</div>
	<div class="flex md:flex-row flex-col w-full justify-center items-center md:space-x-8">
		<span>
			<label class="label" for="month">
				<span class="label-text">Escoger un mes:</span>
			</label>
			<select class="select select-bordered" id="month" bind:value={selectedMonth}>
				<option disabled selected value={-1}>Por favor selecione un mes</option>
				{#each Array.from({ length: 12 }, (_, i) => i + 1) as month}
					<option value={month}
						>{new Date(2023, month - 1, 1).toLocaleString('default', { month: 'long' })}</option
					>
				{/each}
			</select>
		</span>
		<span>
			<label class="label" for="year">
				<span class="label-text">Escoger un año:</span>
			</label>
			<select class="select select-bordered" id="year" bind:value={selectedYear}>
				<option disabled selected value={-1}>Por favor selecione un año</option>
				{#each availableYears as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		</span>
	</div>
	<div class="flex flex-col items-center">
		<h1 class="text-2xl font-bold">Productos</h1>
		<Bar
			data={histogramData}
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
	</div>
	<div class="flex md:flex-row flex-col w-full justify-center items-center">
		<div class="flex flex-col items-center">
			<h1 class="text-2xl font-bold">Tipo de Pedido</h1>
			<Pie data={pedidosData} options={{ responsive: true }} />
		</div>
		<div class="flex flex-col items-center">
			<h1 class="text-2xl font-bold">Tipo de Pago</h1>
			<Pie data={pagoData} options={{ responsive: true }} />
		</div>
	</div>
</div>
