<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();

	const platformLabel: Record<string, string> = {
		ios: 'iOS',
		android: 'Android',
		macos: 'macOS',
		web: 'Web',
		multi: 'Multi-platform'
	};
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
			<ul class="stagger mt-14 border-t border-rule">
				{#each data.apps as app (app.id)}
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
										{platformLabel[app.platform] ?? app.platform}
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
	</div>
</section>
