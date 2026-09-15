<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();

	const app = $derived(data.app);

	const platformLabel: Record<string, string> = {
		ios: 'iOS',
		android: 'Android',
		macos: 'macOS',
		web: 'Web',
		multi: 'Multi-platform'
	};
</script>

<svelte:head>
	<title>{app.name} — David Dyck</title>
	<meta name="description" content={app.tagline || app.description || `${app.name} by David Dyck.`} />
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<Breadcrumb current={app.name} parents={[{ href: '/apps', label: 'Apps' }]} />

		{#if data.preview}
			<p class="mb-8 border border-rule bg-surface px-4 py-3 text-sm">
				Draft preview — only you can see this. Turn on “Show on the public site” in admin to list
				it on /apps.
			</p>
		{/if}

		<div class="flex items-start gap-5">
			{#if app.iconUrl}
				<img
					src={app.iconUrl}
					alt=""
					class="h-16 w-16 shrink-0 border border-rule object-cover sm:h-20 sm:w-20"
				/>
			{/if}
			<div class="min-w-0">
				<h1 class="reveal font-serif text-4xl tracking-tight text-ink sm:text-5xl">{app.name}</h1>
				{#if app.tagline}
					<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{app.tagline}</p>
				{/if}
			</div>
		</div>

		<dl class="mt-10 max-w-2xl border-t border-rule">
			<div class="flex gap-6 border-b border-rule py-3.5">
				<dt class="w-24 shrink-0 text-sm text-muted">Platform</dt>
				<dd>{platformLabel[app.platform] ?? app.platform}</dd>
			</div>
			{#if app.category}
				<div class="flex gap-6 border-b border-rule py-3.5">
					<dt class="w-24 shrink-0 text-sm text-muted">Category</dt>
					<dd>{app.category}</dd>
				</div>
			{/if}
		</dl>

		{#if app.description}
			<div class="mt-10 max-w-2xl whitespace-pre-wrap text-[1.05rem] leading-[1.75]">
				{app.description}
			</div>
		{/if}

		{#if app.appStoreUrl || app.playStoreUrl || app.website || app.supportUrl}
			<p class="mt-10 text-sm">
				{#if app.appStoreUrl}
					<a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" class="text-link">
						App Store
					</a>
				{/if}
				{#if app.appStoreUrl && (app.playStoreUrl || app.website || app.supportUrl)}
					<span class="mx-2 text-muted">/</span>
				{/if}
				{#if app.playStoreUrl}
					<a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer" class="text-link">
						Play Store
					</a>
				{/if}
				{#if app.playStoreUrl && (app.website || app.supportUrl)}
					<span class="mx-2 text-muted">/</span>
				{/if}
				{#if app.website}
					<a href={app.website} target="_blank" rel="noopener noreferrer" class="text-link">Website</a>
				{/if}
				{#if app.website && app.supportUrl}
					<span class="mx-2 text-muted">/</span>
				{/if}
				{#if app.supportUrl}
					<a href={app.supportUrl} target="_blank" rel="noopener noreferrer" class="text-link">Support</a>
				{/if}
			</p>
		{/if}

		<p class="mt-12">
			<a href="/apps/{app.slug}/privacy" class="btn-primary">Privacy policy</a>
		</p>
		<p class="mt-3 max-w-prose text-sm text-muted">
			The privacy policy for this app — what it collects, and how to reach me about it.
		</p>
	</div>
</section>
