<script lang="ts">
	let { data, form } = $props();

	const statuses = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'in-progress', label: 'In progress' },
		{ value: 'shipped', label: 'Shipped' },
		{ value: 'archived', label: 'Archived' }
	];

	const field =
		'w-full rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted';

	function confirmDelete(event: SubmitEvent) {
		if (!confirm('Delete this project? This cannot be undone.')) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>{data.project.title} — Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<p class="text-sm">
	<a href="/admin/projects" class="text-muted hover:text-ink">Projects</a>
	<span class="mx-2 text-muted">/</span>
	<span>Edit</span>
</p>
<h1 class="mt-2 font-serif text-3xl tracking-tight">Edit project</h1>

<form method="POST" action="?/save" class="mt-8 max-w-3xl space-y-5">
	<div>
		<label for="title" class="mb-1.5 block text-sm">Title</label>
		<input id="title" name="title" required value={form?.title ?? data.project.title} class={field} />
	</div>

	<div>
		<label for="slug" class="mb-1.5 block text-sm">Slug</label>
		<input id="slug" name="slug" value={form?.slug ?? data.project.slug} class={field} />
	</div>

	<div>
		<label for="summary" class="mb-1.5 block text-sm">Summary</label>
		<textarea id="summary" name="summary" rows="3" class={field}>{form?.summary ?? data.project.summary ?? ''}</textarea>
	</div>

	<div>
		<label for="description" class="mb-1.5 block text-sm">Description</label>
		<textarea id="description" name="description" rows="8" class={field}
			>{form?.description ?? data.project.description ?? ''}</textarea
		>
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label for="author" class="mb-1.5 block text-sm">Author</label>
			<input id="author" name="author" value={form?.author ?? data.project.author} class={field} />
		</div>
		<div>
			<label for="role" class="mb-1.5 block text-sm">Role</label>
			<input id="role" name="role" value={form?.role ?? data.project.role ?? ''} class={field} />
		</div>
		<div>
			<label for="client" class="mb-1.5 block text-sm">Client</label>
			<input id="client" name="client" value={form?.client ?? data.project.client ?? ''} class={field} />
		</div>
		<div>
			<label for="website" class="mb-1.5 block text-sm">Website</label>
			<input id="website" name="website" value={form?.website ?? data.project.website ?? ''} class={field} />
		</div>
		<div>
			<label for="github" class="mb-1.5 block text-sm">GitHub</label>
			<input id="github" name="github" value={form?.github ?? data.project.github ?? ''} class={field} />
		</div>
		<div>
			<label for="status" class="mb-1.5 block text-sm">Status</label>
			<select id="status" name="status" value={form?.status ?? data.project.status} class={field}>
				{#each statuses as status}
					<option value={status.value}>{status.label}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="year" class="mb-1.5 block text-sm">Year</label>
			<input id="year" name="year" type="number" value={form?.year ?? data.project.year ?? ''} class={field} />
		</div>
		<div>
			<label for="sortOrder" class="mb-1.5 block text-sm">Sort order</label>
			<input
				id="sortOrder"
				name="sortOrder"
				type="number"
				value={form?.sortOrder ?? data.project.sortOrder}
				class={field}
			/>
		</div>
	</div>

	<div>
		<label for="stack" class="mb-1.5 block text-sm">Stack</label>
		<input
			id="stack"
			name="stack"
			value={form?.stack ?? data.project.stack.join(', ')}
			placeholder="Svelte, TypeScript, Postgres"
			class={field}
		/>
	</div>

	<div>
		<label for="coverUrl" class="mb-1.5 block text-sm">Cover URL</label>
		<input id="coverUrl" name="coverUrl" value={form?.coverUrl ?? data.project.coverUrl ?? ''} class={field} />
	</div>

	<div class="flex flex-wrap gap-8">
		<label class="flex items-center gap-2 text-sm">
			<input type="hidden" name="featured" value="false" />
			<input
				type="checkbox"
				name="featured"
				value="true"
				checked={form?.featured ?? data.project.featured}
				class="rounded-none border-rule"
			/>
			Featured
		</label>
		<label class="flex items-center gap-2 text-sm">
			<input type="hidden" name="published" value="false" />
			<input
				type="checkbox"
				name="published"
				value="true"
				checked={form?.published ?? data.project.published}
				class="rounded-none border-rule"
			/>
			Published
		</label>
	</div>

	{#if form?.error}
		<p class="text-sm text-danger" role="alert">{form.error}</p>
	{/if}

	<div class="flex flex-wrap items-center gap-3 pt-2">
		<button type="submit" class="btn-primary">Save</button>
		<a href="/admin/projects" class="inline-flex items-center px-4 py-2 text-sm text-muted hover:text-ink">
			Cancel
		</a>
	</div>
</form>

<form method="POST" action="?/delete" class="mt-12 max-w-3xl border-t border-rule pt-6" onsubmit={confirmDelete}>
	<button type="submit" class="border border-rule px-4 py-2 text-sm text-danger hover:bg-surface">
		Delete project
	</button>
</form>
