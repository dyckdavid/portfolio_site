<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { parseInlineParts, supportParagraphs } from '$lib/support-content';

	let { data } = $props();

	const app = $derived(data.app);
</script>

<svelte:head>
	<title>Support — {app.name}</title>
	<meta
		name="description"
		content="Support for {app.name}: getting started, sync, backups, and how to get help."
	/>
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<article class="max-w-prose">
			<Breadcrumb
				current="Support"
				parents={[
					{ href: '/apps', label: 'Apps' },
					{ href: `/apps/${app.slug}`, label: app.name }
				]}
			/>

			{#if data.preview}
				<p class="mb-8 border border-rule bg-surface px-4 py-3 text-sm">
					Draft preview — only you can see this. Turn on “Show on the public site” in admin for
					Apple and for /apps.
				</p>
			{/if}

			<h1 class="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
				{app.name} Support
			</h1>

			{#if data.contactEmail}
				<p class="mt-8 border border-rule bg-surface px-4 py-4 text-[1.05rem] leading-relaxed">
					<span class="text-muted">Contact.</span>
					{#if data.contactIsMailto}
						Email
						<a href="mailto:{data.contactEmail}" class="text-link">{data.contactEmail}</a>.
					{:else}
						Email {data.contactEmail}.
					{/if}
				</p>
			{/if}

			{#if app.supportIntro}
				<p class="mt-8 text-[1.05rem] leading-[1.75] whitespace-pre-wrap">{app.supportIntro}</p>
			{:else}
				<p class="mt-8 text-[1.05rem] leading-[1.75]">
					Help for {app.name}. If you need something that is not covered here, use the contact
					details above or the
					<a href="/contact" class="text-link">contact page</a>.
				</p>
			{/if}

			{#if data.sections.length === 0}
				<p class="mt-12 leading-relaxed text-muted">
					Detailed support notes have not been published for this app yet.
				</p>
			{:else}
				{#each data.sections as section (section.heading)}
					<h2 class="mt-12 font-serif text-2xl text-ink">{section.heading}</h2>
					{#each supportParagraphs(section.body) as paragraph, i (i)}
						<p class="mt-3 leading-relaxed whitespace-pre-wrap">
							{#each parseInlineParts(paragraph) as part, j (j)}
								{#if part.type === 'link'}
									<a href={part.href} class="text-link">{part.label}</a>
								{:else}
									{part.text}
								{/if}
							{/each}
						</p>
					{/each}
				{/each}
			{/if}

			<p class="mt-14 text-sm text-muted">
				<a href="/apps/{app.slug}" class="text-link">Back to {app.name}</a>
				<span class="mx-2">/</span>
				<a href="/apps/{app.slug}/privacy" class="text-link">Privacy policy</a>
			</p>
		</article>
	</div>
</section>
