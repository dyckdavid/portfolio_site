<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();

	const app = $derived(data.app);
	const dataTypes = $derived(app.dataTypes ?? []);
</script>

<svelte:head>
	<title>Privacy — {app.name}</title>
	<meta
		name="description"
		content="Privacy policy for {app.name}: what this app collects, how data is used, and how to get in touch."
	/>
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<article class="max-w-prose">
			<Breadcrumb
				current="Privacy"
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
				{app.name} privacy policy
			</h1>

			{#if data.lastUpdated}
				<p class="mt-5 text-sm text-muted">Last updated {data.lastUpdated}.</p>
			{:else}
				<p class="mt-5 text-sm text-muted">This policy is current as of the latest release of this app.</p>
			{/if}

			{#if app.privacyIntro}
				<p class="mt-8 text-[1.05rem] leading-[1.75] whitespace-pre-wrap">{app.privacyIntro}</p>
			{:else}
				<p class="mt-8 text-[1.05rem] leading-[1.75]">
					This page describes how {app.name} handles information. It is written for the people who
					use this app, and for App Store review.
				</p>
			{/if}

			<h2 class="mt-12 font-serif text-2xl text-ink">Data this app collects</h2>
			{#if app.collectsData}
				<p class="mt-3 leading-relaxed">
					This app collects data. The categories and purposes are listed below.
				</p>
			{:else}
				<p class="mt-3 leading-relaxed">This app does not collect data.</p>
			{/if}

			<h2 class="mt-12 font-serif text-2xl text-ink">Tracking</h2>
			{#if app.dataUsedForTracking}
				<p class="mt-3 leading-relaxed">
					Data collected by this app is used for tracking, as defined by Apple’s App Store privacy
					rules.
				</p>
			{:else}
				<p class="mt-3 leading-relaxed">This app does not use data for tracking.</p>
			{/if}

			<h2 class="mt-12 font-serif text-2xl text-ink">Data linked to identity</h2>
			{#if app.dataLinkedToIdentity}
				<p class="mt-3 leading-relaxed">
					Some data collected by this app is linked to the user’s identity.
				</p>
			{:else}
				<p class="mt-3 leading-relaxed">
					This app does not link collected data to the user’s identity.
				</p>
			{/if}

			<h2 class="mt-12 font-serif text-2xl text-ink">Data types</h2>
			{#if dataTypes.length === 0}
				<p class="mt-3 leading-relaxed">
					{#if app.collectsData}
						The data types this app collects have not been listed here yet. If you have a question
						about a specific type of data, use the contact email below.
					{:else}
						No data types are collected by this app.
					{/if}
				</p>
			{:else}
				<ul class="mt-4 space-y-6">
					{#each dataTypes as entry, i (i)}
						<li class="border-t border-rule pt-5">
							<p class="font-serif text-lg">{entry.category || 'Data'}</p>
							{#if entry.types}
								<p class="mt-2 text-sm leading-relaxed">
									<span class="text-muted">Types.</span>
									{entry.types}
								</p>
							{/if}
							{#if entry.purpose}
								<p class="mt-1 text-sm leading-relaxed">
									<span class="text-muted">Purpose.</span>
									{entry.purpose}
								</p>
							{/if}
							<p class="mt-1 text-sm leading-relaxed text-muted">
								Linked to the user: {entry.linkedToUser ? 'yes' : 'no'}. Used for tracking:
								{entry.usedForTracking ? 'yes' : 'no'}.
							</p>
						</li>
					{/each}
				</ul>
			{/if}

			<h2 class="mt-12 font-serif text-2xl text-ink">Third parties</h2>
			{#if app.thirdParties}
				<p class="mt-3 leading-relaxed whitespace-pre-wrap">{app.thirdParties}</p>
			{:else}
				<p class="mt-3 leading-relaxed">
					This app does not share data with third parties for advertising. If a service is used to
					run the app itself (for example, hosting), that service only processes what it needs to
					operate.
				</p>
			{/if}

			<h2 class="mt-12 font-serif text-2xl text-ink">Children</h2>
			{#if app.childrenPolicy}
				<p class="mt-3 leading-relaxed whitespace-pre-wrap">{app.childrenPolicy}</p>
			{:else}
				<p class="mt-3 leading-relaxed">This app is not directed at children.</p>
			{/if}

			<h2 class="mt-12 font-serif text-2xl text-ink">Contact</h2>
			{#if app.privacyContactEmail}
				<p class="mt-3 leading-relaxed">
					Questions about this policy, or requests about data this app holds, go to
					<a href="mailto:{app.privacyContactEmail}" class="text-link">{app.privacyContactEmail}</a>.
				</p>
			{:else}
				<p class="mt-3 leading-relaxed">
					Questions about this policy can be sent through the
					<a href="/contact" class="text-link">contact page</a>.
				</p>
			{/if}

			<p class="mt-14 text-sm text-muted">
				<a href="/apps/{app.slug}" class="text-link">Back to {app.name}</a>
			</p>
		</article>
	</div>
</section>
