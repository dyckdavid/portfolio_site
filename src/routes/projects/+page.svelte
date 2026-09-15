<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Work — David Dyck</title>
	<meta name="description" content="Selected work by David Dyck — things shipped, or still shipping." />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<Breadcrumb current="Work" />
		<header class="reveal">
			<h1 class="font-serif text-4xl tracking-tight text-ink sm:text-5xl">Work</h1>
			<p class="mt-5 max-w-xl leading-relaxed text-muted">
				Things I have shipped, or am still shipping. A small archive — not a case-study factory.
			</p>
		</header>

		{#if data.projects.length === 0}
			<div class="mt-16">
				<p class="font-serif text-xl text-ink">Nothing here yet.</p>
				<p class="mt-2 text-muted">
					Check back later, or
					<a href="/contact" class="text-link">get in touch</a>.
				</p>
			</div>
		{:else}
			<ul class="stagger mt-14 border-t border-rule">
				{#each data.projects as project (project.id)}
					<li class="-mx-3 rounded-sm border-b border-rule px-3 py-8 transition-colors hover:bg-surface">
						<h2 class="font-serif text-2xl text-ink sm:text-3xl">
							<a href="/projects/{project.slug}" class="hover:text-accent">
								{project.title}
							</a>
						</h2>
						{#if project.year || project.role}
							<p class="mt-2 text-sm text-muted">
								{#if project.year}{project.year}{/if}{#if project.year && project.role}
									{' · '}{/if}{#if project.role}{project.role}{/if}
							</p>
						{/if}
						{#if project.summary}
							<p class="mt-4 max-w-2xl leading-relaxed">{project.summary}</p>
						{/if}
						{#if project.stack?.length}
							<p class="mt-3 text-sm text-muted">{project.stack.join(', ')}</p>
						{/if}
						{#if project.website || project.github}
							<p class="mt-4 text-sm">
								{#if project.website}
									<a
										href={project.website}
										target="_blank"
										rel="noopener noreferrer"
										class="text-link"
									>
										Site
									</a>
								{/if}
								{#if project.website && project.github}
									<span class="mx-2 text-muted">/</span>
								{/if}
								{#if project.github}
									<a
										href={project.github}
										target="_blank"
										rel="noopener noreferrer"
										class="text-link"
									>
										Code
									</a>
								{/if}
							</p>
						{/if}
					</li>
				{/each}
			</ul>
			<p class="mt-8 text-sm text-muted">
				{data.projects.length} {data.projects.length === 1 ? 'entry' : 'entries'}
			</p>
		{/if}
	</div>
</section>
