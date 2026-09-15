<script lang="ts">
	import AiDraft from '$lib/components/AiDraft.svelte';
	import { defaultProjectFormValues, type ProjectFormValues } from '$lib/project-form';

	let { form } = $props();

	const statuses = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'in-progress', label: 'In progress' },
		{ value: 'shipped', label: 'Shipped' },
		{ value: 'archived', label: 'Archived' }
	];

	const field =
		'w-full rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted';

	let values = $state<ProjectFormValues>({
		...defaultProjectFormValues(),
		...(form ?? {})
	});

	function applyDraft(draft: Record<string, unknown>) {
		values = { ...values, ...(draft as ProjectFormValues) };
	}
</script>

<svelte:head>
	<title>New project — Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<p class="text-sm">
	<a href="/admin/projects" class="text-muted hover:text-ink">Projects</a>
	<span class="mx-2 text-muted">/</span>
	<span>New</span>
</p>
<h1 class="mt-2 font-serif text-3xl tracking-tight">New project</h1>

<div class="mt-8 max-w-3xl">
	<AiDraft kind="project" onapply={applyDraft} />
</div>

<form method="POST" class="max-w-3xl space-y-5">
	<div>
		<label for="title" class="mb-1.5 block text-sm">Title</label>
		<input id="title" name="title" required bind:value={values.title} class={field} />
	</div>

	<div>
		<label for="slug" class="mb-1.5 block text-sm">Slug</label>
		<input
			id="slug"
			name="slug"
			bind:value={values.slug}
			placeholder="Leave blank to generate from the title"
			class={field}
		/>
	</div>

	<div>
		<label for="summary" class="mb-1.5 block text-sm">Summary</label>
		<textarea id="summary" name="summary" rows="3" class={field} bind:value={values.summary}></textarea>
	</div>

	<div>
		<label for="description" class="mb-1.5 block text-sm">Description</label>
		<textarea id="description" name="description" rows="8" class={field} bind:value={values.description}></textarea>
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label for="author" class="mb-1.5 block text-sm">Author</label>
			<input id="author" name="author" bind:value={values.author} class={field} />
		</div>
		<div>
			<label for="role" class="mb-1.5 block text-sm">Role</label>
			<input id="role" name="role" bind:value={values.role} class={field} />
		</div>
		<div>
			<label for="client" class="mb-1.5 block text-sm">Client</label>
			<input id="client" name="client" bind:value={values.client} class={field} />
		</div>
		<div>
			<label for="website" class="mb-1.5 block text-sm">Website</label>
			<input id="website" name="website" bind:value={values.website} class={field} />
		</div>
		<div>
			<label for="github" class="mb-1.5 block text-sm">GitHub</label>
			<input id="github" name="github" bind:value={values.github} class={field} />
		</div>
		<div>
			<label for="status" class="mb-1.5 block text-sm">Status</label>
			<select id="status" name="status" bind:value={values.status} class={field}>
				{#each statuses as status}
					<option value={status.value}>{status.label}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="year" class="mb-1.5 block text-sm">Year</label>
			<input id="year" name="year" type="number" bind:value={values.year} class={field} />
		</div>
		<div>
			<label for="sortOrder" class="mb-1.5 block text-sm">Sort order</label>
			<input id="sortOrder" name="sortOrder" type="number" bind:value={values.sortOrder} class={field} />
		</div>
	</div>

	<div>
		<label for="stack" class="mb-1.5 block text-sm">Stack</label>
		<input
			id="stack"
			name="stack"
			bind:value={values.stack}
			placeholder="Svelte, TypeScript, Postgres"
			class={field}
		/>
	</div>

	<div>
		<label for="coverUrl" class="mb-1.5 block text-sm">Cover URL</label>
		<input id="coverUrl" name="coverUrl" bind:value={values.coverUrl} class={field} />
	</div>

	<div class="flex flex-wrap gap-8">
		<label class="flex items-center gap-2 text-sm">
			<input type="hidden" name="featured" value="false" />
			<input
				type="checkbox"
				name="featured"
				value="true"
				bind:checked={values.featured}
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
				bind:checked={values.published}
				class="rounded-none border-rule"
			/>
			Published
		</label>
	</div>

	{#if form?.error}
		<p class="text-sm text-danger" role="alert">{form.error}</p>
	{/if}

	<div class="flex gap-3 pt-2">
		<button type="submit" class="btn-primary">Create project</button>
		<a href="/admin/projects" class="inline-flex items-center px-4 py-2 text-sm text-muted hover:text-ink">
			Cancel
		</a>
	</div>
</form>
