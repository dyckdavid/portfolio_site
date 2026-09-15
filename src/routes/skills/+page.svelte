<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const groups = [
		{
			name: 'Interfaces',
			items: 'Pages, forms, and states that stay readable after the visual pass — empty, error, and the cases nobody demoed.'
		},
		{
			name: 'Services',
			items: 'APIs with contracts you can rely on, not a pile of special cases that only make sense if you wrote them.'
		},
		{
			name: 'Data',
			items: 'Models that match how the product actually works, including the awkward parts people hope they can paper over.'
		},
		{
			name: 'Environment',
			items: 'I work on macOS, Windows, and Linux. Clients have machines. If it only runs where I developed it, it isn’t finished.'
		}
	];
</script>

<svelte:head>
	<title>Skills — David Dyck</title>
	<meta
		name="description"
		content="What David Dyck actually does — interfaces, services, data, and shipping on other people’s machines."
	/>
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<Breadcrumb current="Skills" />
		<header class="reveal">
			<h1 class="font-serif text-4xl tracking-tight text-ink sm:text-5xl">Skills</h1>
			<p class="mt-5 max-w-xl leading-relaxed text-muted">
				What the work is. Not a list of libraries.
			</p>
		</header>

		<dl class="stagger mt-14 border-t border-rule">
			{#each groups as group}
				<div
					class="grid grid-cols-1 gap-1 border-b border-rule py-5 sm:grid-cols-[11rem_1fr] sm:gap-8"
				>
					<dt class="font-serif text-lg text-ink">{group.name}</dt>
					<dd class="leading-relaxed text-muted">{group.items}</dd>
				</div>
			{/each}
		</dl>

		<p class="mt-12 max-w-xl leading-relaxed text-muted">
			I use whatever a codebase already runs on. Percentages would be theater. When it fits, I
			pick the boring reliable option, not the one that looks newest on a résumé.
		</p>
	</div>
</section>
