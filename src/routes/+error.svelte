<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} — David Dyck</title>
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<p class="reveal font-mono text-xs uppercase tracking-wide text-muted">{$page.status}</p>
		<h1 class="reveal reveal-2 mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
			{$page.status === 404 ? 'No page here.' : 'Something broke.'}
		</h1>
		<p class="mt-5 max-w-md leading-relaxed text-muted">
			{#if $page.status === 404}
				That URL isn’t on this site. It may have moved, or it never existed.
			{:else}
				{$page.error?.message ?? 'The page failed to load.'}
			{/if}
		</p>
		<p class="mt-8">
			<a href="/" class="btn-primary">Back home</a>
		</p>
	</div>
</section>
