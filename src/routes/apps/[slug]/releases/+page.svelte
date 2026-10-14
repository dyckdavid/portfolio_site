<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Markdown from '$lib/components/Markdown.svelte';

	let { data } = $props();

	const app = $derived(data.app);
</script>

<svelte:head>
	<title>Releases — {app.name}</title>
	<meta name="description" content="Release notes and changelog for {app.name}." />
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<article class="max-w-2xl">
			<Breadcrumb
				current="Releases"
				parents={[
					{ href: '/apps', label: 'Apps' },
					{ href: `/apps/${app.slug}`, label: app.name }
				]}
			/>

			{#if data.preview}
				<p class="mb-8 border border-rule bg-surface px-4 py-3 text-sm">
					Draft preview — only you can see this.
				</p>
			{/if}

			<h1 class="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
				{app.name} releases
			</h1>
			<p class="mt-4 text-muted">Changelog for every published version.</p>

			{#if data.releases.length === 0}
				<p class="mt-10 text-sm text-muted">No release notes yet.</p>
			{:else}
				<ol class="mt-12 space-y-12">
					{#each data.releases as release (release.id)}
						<li
							class="border-t border-rule pt-8 {release.latest
								? '-mx-4 bg-surface px-4 pb-6'
								: ''}"
						>
							<div class="flex flex-wrap items-baseline gap-3">
								<h2 class="font-serif text-2xl tracking-tight">v{release.version}</h2>
								{#if release.latest}
									<span class="font-mono text-xs uppercase tracking-[0.14em] text-muted">Latest</span>
								{/if}
							</div>
							{#if release.releaseDateLabel}
								<p class="mt-2 font-mono text-sm text-muted">{release.releaseDateLabel}</p>
							{/if}
							{#if release.notesHtml}
								<div class="mt-4">
									<Markdown html={release.notesHtml} />
								</div>
							{/if}
						</li>
					{/each}
				</ol>
			{/if}

			<p class="mt-14 text-sm text-muted">
				<a href="/apps/{app.slug}" class="text-link">Back to {app.name}</a>
			</p>
		</article>
	</div>
</section>
