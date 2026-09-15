<script lang="ts">
	let { data, form } = $props();

	const statusLabel: Record<string, string> = {
		draft: 'Draft',
		'in-progress': 'In progress',
		shipped: 'Shipped',
		archived: 'Archived'
	};

	function confirmDelete(event: SubmitEvent) {
		if (!confirm('Delete this project? This cannot be undone.')) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Projects — Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex items-end justify-between gap-4 border-b border-rule pb-6">
	<div>
		<p class="text-sm text-muted">Admin</p>
		<h1 class="font-serif text-3xl tracking-tight">Projects</h1>
	</div>
	<a href="/admin/projects/new" class="btn-primary">New project</a>
</div>

{#if form?.error}
	<p class="mt-4 text-sm text-danger" role="alert">{form.error}</p>
{/if}

{#if data.projects.length === 0}
	<p class="mt-10 text-muted">No projects yet.</p>
{:else}
	<div class="mt-8 overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead>
				<tr class="border-b border-rule text-muted">
					<th class="py-2 pr-4 font-medium">Title</th>
					<th class="py-2 pr-4 font-medium">Status</th>
					<th class="py-2 pr-4 font-medium">Year</th>
					<th class="py-2 pr-4 font-medium">Published</th>
					<th class="py-2 pr-4 font-medium">Featured</th>
					<th class="py-2 font-medium"><span class="sr-only">Actions</span></th>
				</tr>
			</thead>
			<tbody>
				{#each data.projects as project (project.id)}
					<tr class="border-b border-rule">
						<td class="py-3 pr-4">{project.title}</td>
						<td class="py-3 pr-4">{statusLabel[project.status] ?? project.status}</td>
						<td class="py-3 pr-4">{project.year ?? '—'}</td>
						<td class="py-3 pr-4">{project.published ? 'Yes' : 'No'}</td>
						<td class="py-3 pr-4">{project.featured ? 'Yes' : 'No'}</td>
						<td class="py-3">
							<div class="flex items-center justify-end gap-4">
								<a href="/admin/projects/{project.id}" class="text-link">Edit</a>
								<form method="POST" action="?/delete" onsubmit={confirmDelete}>
									<input type="hidden" name="id" value={project.id} />
									<button type="submit" class="text-danger hover:underline">Delete</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
