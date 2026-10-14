<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DownloadBlock from '$lib/components/DownloadBlock.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import { formatPlatforms } from '$lib/platforms';

	let { data } = $props();

	const app = $derived(data.app);
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
				<dd>{formatPlatforms(app)}</dd>
			</div>
			{#if app.category}
				<div class="flex gap-6 border-b border-rule py-3.5">
					<dt class="w-24 shrink-0 text-sm text-muted">Category</dt>
					<dd>{app.category}</dd>
				</div>
			{/if}
			{#if app.version}
				<div class="flex gap-6 border-b border-rule py-3.5">
					<dt class="w-24 shrink-0 text-sm text-muted">Version</dt>
					<dd class="font-mono text-sm">{app.version}</dd>
				</div>
			{/if}
		</dl>

		{#if data.descriptionHtml}
			<div class="mt-10 max-w-2xl text-[1.05rem] leading-[1.75]">
				<Markdown html={data.descriptionHtml} />
			</div>
		{/if}

		{#if app.downloadUrl}
			<DownloadBlock
				downloadUrl={app.downloadUrl}
				sha256={app.sha256}
				version={app.version}
				fileSize={app.fileSize}
				requirements={app.requirements}
			/>
		{/if}

		{#if app.appStoreUrl || app.playStoreUrl || app.website}
			<p class="mt-10 text-sm">
				{#if app.appStoreUrl}
					<a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" class="text-link">
						App Store
					</a>
				{/if}
				{#if app.appStoreUrl && (app.playStoreUrl || app.website)}
					<span class="mx-2 text-muted">/</span>
				{/if}
				{#if app.playStoreUrl}
					<a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer" class="text-link">
						Play Store
					</a>
				{/if}
				{#if app.playStoreUrl && app.website}
					<span class="mx-2 text-muted">/</span>
				{/if}
				{#if app.website}
					<a href={app.website} target="_blank" rel="noopener noreferrer" class="text-link">Website</a>
				{/if}
			</p>
		{/if}

		{#if data.latestRelease}
			<section class="mt-14 max-w-2xl border-t border-rule pt-10">
				<div class="flex flex-wrap items-baseline justify-between gap-3">
					<h2 class="font-serif text-2xl tracking-tight">What’s new</h2>
					{#if data.releaseCount > 1}
						<a href="/apps/{app.slug}/releases" class="text-sm text-link">All releases</a>
					{/if}
				</div>
				<p class="mt-3 font-mono text-sm text-muted">
					<span class="rounded-sm bg-surface px-2 py-0.5 text-ink">Latest</span>
					<span class="ml-2">v{data.latestRelease.version}</span>
					{#if data.latestRelease.releaseDateLabel}
						<span class="mx-2">·</span>
						<span>{data.latestRelease.releaseDateLabel}</span>
					{/if}
				</p>
				{#if data.latestRelease.notesHtml}
					<div class="mt-4">
						<Markdown html={data.latestRelease.notesHtml} />
					</div>
				{/if}
				{#if data.releaseCount === 1}
					<p class="mt-4 text-sm">
						<a href="/apps/{app.slug}/releases" class="text-link">Release history</a>
					</p>
				{/if}
			</section>
		{/if}

		<div class="mt-12 flex flex-wrap gap-3">
			<a href="/apps/{app.slug}/support" class="btn-primary">Support</a>
			<a href="/apps/{app.slug}/privacy" class="btn-primary">Privacy policy</a>
		</div>
		<p class="mt-3 max-w-prose text-sm text-muted">
			Support covers getting started and common questions. The privacy policy explains what the app
			collects, and how to reach me about it.
		</p>
	</div>
</section>
