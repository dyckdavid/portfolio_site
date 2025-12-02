<script lang="ts">
	import Navbar from '$lib/images/components/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="app min-h-screen bg-hacker-black relative z-10">
	<Navbar />

	<main class="relative z-10">
		{@render children()}
	</main>
</div>
