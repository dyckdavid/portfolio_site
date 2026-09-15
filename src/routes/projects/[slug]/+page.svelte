<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();

	const project = $derived(data.project);

	function formatStatus(status: string) {
		return status
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

<svelte:head>
	<title>{project.title} — David Dyck</title>
	<meta
		name="description"
		content={project.summary ?? `Work by David Dyck: ${project.title}`}
	/>
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<Breadcrumb current={project.title} />

		<p class="text-sm text-muted">
			<a href="/projects" class="text-link">Work</a>
		</p>

		<h1 class="reveal mt-3 font-serif text-4xl tracking-tight text-ink sm:text-5xl">
			{project.title}
		</h1>

		{#if project.summary}
			<p class="mt-5 max-w-2xl leading-relaxed text-muted">{project.summary}</p>
		{/if}

		{#if project.coverUrl}
			<img
				src={project.coverUrl}
				alt=""
				class="img-zoom mt-10 w-full border border-rule bg-surface object-cover"
			/>
		{/if}

		<dl class="mt-10 max-w-2xl border-t border-rule">
			{#if project.role}
				<div class="flex gap-6 border-b border-rule py-3.5">
					<dt class="w-24 shrink-0 text-sm text-muted">Role</dt>
					<dd>{project.role}</dd>
				</div>
			{/if}
			{#if project.client}
				<div class="flex gap-6 border-b border-rule py-3.5">
					<dt class="w-24 shrink-0 text-sm text-muted">Client</dt>
					<dd>{project.client}</dd>
				</div>
			{/if}
			{#if project.year}
				<div class="flex gap-6 border-b border-rule py-3.5">
					<dt class="w-24 shrink-0 text-sm text-muted">Year</dt>
					<dd>{project.year}</dd>
				</div>
			{/if}
			{#if project.status}
				<div class="flex gap-6 border-b border-rule py-3.5">
					<dt class="w-24 shrink-0 text-sm text-muted">Status</dt>
					<dd>{formatStatus(project.status)}</dd>
				</div>
			{/if}
			{#if project.stack?.length}
				<div class="flex gap-6 border-b border-rule py-3.5">
					<dt class="w-24 shrink-0 text-sm text-muted">Stack</dt>
					<dd>{project.stack.join(', ')}</dd>
				</div>
			{/if}
		</dl>

		{#if project.description}
			<div class="mt-10 max-w-2xl whitespace-pre-wrap text-[1.05rem] leading-[1.75]">
				{project.description}
			</div>
		{/if}

		{#if project.website || project.github}
			<p class="mt-10 text-sm">
				{#if project.website}
					<a href={project.website} target="_blank" rel="noopener noreferrer" class="text-link">
						Site
					</a>
				{/if}
				{#if project.website && project.github}
					<span class="mx-2 text-muted">/</span>
				{/if}
				{#if project.github}
					<a href={project.github} target="_blank" rel="noopener noreferrer" class="text-link">
						Code
					</a>
				{/if}
			</p>
		{/if}
	</div>
</section>
