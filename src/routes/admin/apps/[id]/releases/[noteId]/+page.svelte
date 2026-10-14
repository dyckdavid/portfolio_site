<script lang="ts">
	let { data, form } = $props();

	const field =
		'w-full rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted';

	let values = $state({ ...(form?.values ?? data.values) });

	function confirmDelete(event: SubmitEvent) {
		if (!confirm('Delete this release note?')) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Edit release — {data.app.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<p class="text-sm">
	<a href="/admin/apps" class="text-muted hover:text-ink">Apps</a>
	<span class="mx-2 text-muted">/</span>
	<a href="/admin/apps/{data.app.id}" class="text-muted hover:text-ink">{data.app.name}</a>
	<span class="mx-2 text-muted">/</span>
	<a href="/admin/apps/{data.app.id}/releases" class="text-muted hover:text-ink">Releases</a>
	<span class="mx-2 text-muted">/</span>
	<span>Edit</span>
</p>
<h1 class="mt-2 font-serif text-3xl tracking-tight">Edit release note</h1>

{#if form?.saved}
	<p class="mt-6 border border-rule bg-surface px-3 py-2.5 text-sm" role="status">Saved.</p>
{/if}

<form method="POST" action="?/save" class="mt-8 max-w-3xl space-y-4">
	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<label for="version" class="mb-1.5 block text-sm">Version</label>
			<input id="version" name="version" required bind:value={values.version} class={field} />
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
		<textarea id="notes" name="notes" rows="14" class={field} bind:value={values.notes}></textarea>
	</div>
	{#if form?.error}
		<p class="text-sm text-danger" role="alert">{form.error}</p>
	{/if}
	<div class="flex flex-wrap gap-3">
		<button type="submit" class="btn-primary">Save</button>
		<a href="/admin/apps/{data.app.id}/releases" class="inline-flex items-center px-4 py-2 text-sm text-muted hover:text-ink">
			Back
		</a>
	</div>
</form>

<form method="POST" action="?/delete" class="mt-12 max-w-3xl border-t border-rule pt-6" onsubmit={confirmDelete}>
	<button type="submit" class="border border-rule px-4 py-2 text-sm text-danger hover:bg-surface">
		Delete release note
	</button>
</form>
