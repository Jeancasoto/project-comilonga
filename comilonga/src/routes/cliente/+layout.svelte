<script>
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/navbar.svelte';
</script>

<span>
	<Navbar />
	<slot />
	<Footer />
</span>
