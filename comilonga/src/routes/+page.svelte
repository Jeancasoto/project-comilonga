<script>
	import { db } from '$lib/firebase';
	import { collectionGroup, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	let name = '';
	let startDate = '';
	onMount(async () => {
		const testCollection = collectionGroup(db, 'test');
		const docs = await getDocs(testCollection);
		const mappedDocs = docs.docs.map((t) => t.data());
		const first = mappedDocs[0];
		name = `${first.firstName} ${first.lastName}`;
		startDate = new Date(first.startDate).toISOString();
	});
</script>

<div class="flex justify-center items-center flex-col">
	<div class="hero min-h-screen bg-base-200">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">Hello {name}</h1>
				<p class="py-6">
					Provident cupiditate voluptatem et in. Quaerat {startDate} ut assumenda excepturi exercitationem
					quasi. In deleniti eaque aut repudiandae et a id nisi.
				</p>
				<button class="btn btn-primary">Get Started</button>
			</div>
		</div>
	</div>
</div>
