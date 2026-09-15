<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { formatPlatforms, platformLabel, resolvePlatforms } from '$lib/platforms';

	let { data } = $props();

	let filter = $state('all');

	const filters = $derived.by(() => {
		const ids = new Set<string>();
		for (const app of data.apps) {
			for (const id of resolvePlatforms(app)) ids.add(id);
		}
		return [...ids].sort((a, b) => platformLabel(a).localeCompare(platformLabel(b)));
	});

	const visible = $derived(
		filter === 'all'
			? data.apps
			: data.apps.filter((app) => resolvePlatforms(app).some((id) => id === filter))
	);
</script>

<svelte:head>
	<title>Apps — David Dyck</title>
	<meta
		name="description"
		content="Software shipped on phones and the store — apps by David Dyck."
	/>
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<Breadcrumb current="Apps" />
		<header class="reveal">
			<h1 class="font-serif text-4xl tracking-tight text-ink sm:text-5xl">Apps</h1>
			<p class="mt-5 max-w-xl leading-relaxed text-muted">
				Software shipped on phones and the store.
			</p>
		</header>

		{#if data.apps.length === 0}
			<p class="mt-16 text-muted">Nothing listed yet.</p>
		{:else}
			{#if filters.length > 1}
				<div class="mt-10 flex flex-wrap gap-2">
					<button
						type="button"
						class="border px-3 py-1 text-sm {filter === 'all'
							? 'border-ink text-ink'
							: 'border-rule text-muted hover:text-ink'}"
						onclick={() => (filter = 'all')}
					>
						All
					</button>
					{#each filters as id}
						<button
							type="button"
							class="border px-3 py-1 text-sm {filter === id
								? 'border-ink text-ink'
								: 'border-rule text-muted hover:text-ink'}"
							onclick={() => (filter = id)}
						>
							{platformLabel(id)}
						</button>
					{/each}
				</div>
			{/if}

			{#if visible.length === 0}
				<p class="mt-16 text-muted">Nothing on that platform yet.</p>
			{:else}
			<ul class="stagger mt-14 border-t border-rule">
				{#each visible as app (app.id)}
					<li class="-mx-3 border-b border-rule px-3 py-8 transition-colors hover:bg-surface">
						<a href="/apps/{app.slug}" class="group block">
							<div class="flex items-start gap-4">
								{#if app.iconUrl}
									<img
										src={app.iconUrl}
										alt=""
										class="h-12 w-12 shrink-0 border border-rule object-cover"
									/>
								{/if}
								<div class="min-w-0 flex-1">
									<h2 class="font-serif text-2xl text-ink group-hover:text-accent sm:text-3xl">
										{app.name}
									</h2>
									<p class="mt-2 text-sm text-muted">
										{formatPlatforms(app)}
										{#if app.category}
											<span class="mx-1.5">·</span>
											{app.category}
										{/if}
										{#if app.featured}
											<span class="mx-1.5">·</span>
											Featured
										{/if}
									</p>
									{#if app.tagline}
										<p class="mt-3 max-w-2xl leading-relaxed">{app.tagline}</p>
									{/if}
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
			{/if}
		{/if}
	</div>
</section>
