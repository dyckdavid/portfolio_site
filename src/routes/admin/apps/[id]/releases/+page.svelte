<script lang="ts">
	let { data, form } = $props();

	const field =
		'w-full rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted';

	let values = $state({ ...(form?.values ?? data.values) });
</script>

<svelte:head>
	<title>Release notes — {data.app.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<p class="text-sm">
	<a href="/admin/apps" class="text-muted hover:text-ink">Apps</a>
	<span class="mx-2 text-muted">/</span>
	<a href="/admin/apps/{data.app.id}" class="text-muted hover:text-ink">{data.app.name}</a>
	<span class="mx-2 text-muted">/</span>
	<span>Releases</span>
</p>
<h1 class="mt-2 font-serif text-3xl tracking-tight">Release notes</h1>
<p class="mt-3 max-w-xl text-sm leading-relaxed text-muted">
	Public changelog on
	<a href="/apps/{data.app.slug}" class="text-link">/apps/{data.app.slug}</a>
	and the full list at
	<a href="/apps/{data.app.slug}/releases" class="text-link">/apps/{data.app.slug}/releases</a>.
	Markdown is supported in the notes body.
</p>

<section class="mt-10 max-w-3xl">
	<h2 class="font-serif text-xl tracking-tight">Add a release</h2>
	<form method="POST" action="?/create" class="mt-4 space-y-4">
		<div class="grid gap-4 sm:grid-cols-2">
			<div>
				<label for="version" class="mb-1.5 block text-sm">Version</label>
				<input id="version" name="version" required bind:value={values.version} class={field} placeholder="2.0.0" />
			</div>
			<div>
				<label for="releaseDate" class="mb-1.5 block text-sm">Release date</label>
				<input
					id="releaseDate"
					name="releaseDate"
					type="date"
					required
					bind:value={values.releaseDate}
					class={field}
				/>
			</div>
		</div>
		<div>
			<label for="notes" class="mb-1.5 block text-sm">Notes (Markdown)</label>
			<textarea id="notes" name="notes" rows="10" class={field} bind:value={values.notes}></textarea>
		</div>
		{#if form?.error}
			<p class="text-sm text-danger" role="alert">{form.error}</p>
		{/if}
		<button type="submit" class="btn-primary">Add release</button>
	</form>
</section>

<section class="mt-14 max-w-3xl">
	<h2 class="font-serif text-xl tracking-tight">Existing releases</h2>
	{#if data.notes.length === 0}
		<p class="mt-4 text-sm text-muted">None yet.</p>
	{:else}
		<ul class="mt-4 divide-y divide-rule border-y border-rule">
			{#each data.notes as note (note.id)}
				<li class="flex flex-wrap items-start justify-between gap-4 py-4">
					<div class="min-w-0">
						<p class="font-mono text-sm">
							v{note.version}
							{#if note.releaseDateLabel}
								<span class="mx-2 text-muted">·</span>
								<span class="text-muted">{note.releaseDateLabel}</span>
							{/if}
						</p>
						{#if note.notes}
							<p class="mt-2 whitespace-pre-wrap text-sm text-muted">{note.notes.slice(0, 180)}{note.notes.length > 180 ? '…' : ''}</p>
						{/if}
					</div>
					<div class="flex gap-3 text-sm">
						<a href="/admin/apps/{data.app.id}/releases/{note.id}" class="text-link">Edit</a>
						<form method="POST" action="?/delete">
							<input type="hidden" name="id" value={note.id} />
							<button type="submit" class="text-danger hover:underline">Delete</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>
