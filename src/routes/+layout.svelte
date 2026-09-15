<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children } = $props();

	const isAdmin = $derived($page.url.pathname.startsWith('/admin'));
</script>

<div class="flex min-h-screen flex-col bg-paper text-ink">
	{#if isAdmin}
		{@render children()}
	{:else}
		<a href="#main-content" class="skip-link">Skip to content</a>
		<Navbar />
		<main id="main-content" class="flex-1">
			{@render children()}
		</main>
		<Footer />
	{/if}
</div>
