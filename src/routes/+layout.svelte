<script lang="ts">
	import Navbar from '$lib/images/components/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<Navbar />

	<main>
		{@render children()}
	</main>

	
</div>
