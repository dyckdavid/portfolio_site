<script lang="ts">
	let {
		current,
		parents = []
	}: {
		current: string;
		parents?: { href: string; label: string }[];
	} = $props();
</script>

<nav aria-label="Breadcrumb" class="mb-6 text-sm text-muted">
	<ol class="flex flex-wrap items-center gap-2">
		<li>
			<a href="/" class="hover:text-ink">Home</a>
		</li>
		{#each parents as parent}
			<li aria-hidden="true">/</li>
			<li>
				<a href={parent.href} class="hover:text-ink">{parent.label}</a>
			</li>
		{/each}
		<li aria-hidden="true">/</li>
		<li class="text-ink" aria-current="page">{current}</li>
	</ol>
</nav>
