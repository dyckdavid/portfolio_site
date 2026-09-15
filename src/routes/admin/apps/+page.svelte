<script lang="ts">
	let { data, form } = $props();

	const platformLabel: Record<string, string> = {
		ios: 'iOS',
		android: 'Android',
		macos: 'macOS',
		web: 'Web',
		multi: 'Multi'
	};

	const statusLabel: Record<string, string> = {
		development: 'Development',
		'in-review': 'In review',
		live: 'Live',
		sunset: 'Sunset'
	};

	function confirmDelete(event: SubmitEvent) {
		if (!confirm('Delete this app? This cannot be undone.')) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Apps — Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex items-end justify-between gap-4 border-b border-rule pb-6">
	<div>
		<p class="text-sm text-muted">Admin</p>
		<h1 class="font-serif text-3xl tracking-tight">Apps</h1>
	</div>
	<a href="/admin/apps/new" class="btn-primary">New app</a>
</div>

{#if form?.error}
	<p class="mt-4 text-sm text-danger" role="alert">{form.error}</p>
{/if}

{#if data.apps.length === 0}
	<p class="mt-10 text-muted">No apps yet.</p>
{:else}
	<div class="mt-8 overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead>
				<tr class="border-b border-rule text-muted">
					<th class="py-2 pr-4 font-medium">Name</th>
					<th class="py-2 pr-4 font-medium">Platform</th>
					<th class="py-2 pr-4 font-medium">Status</th>
					<th class="py-2 pr-4 font-medium">Published</th>
					<th class="py-2 pr-4 font-medium">Featured</th>
					<th class="py-2 font-medium"><span class="sr-only">Actions</span></th>
				</tr>
			</thead>
			<tbody>
				{#each data.apps as app (app.id)}
					<tr class="border-b border-rule">
						<td class="py-3 pr-4">{app.name}</td>
						<td class="py-3 pr-4">{platformLabel[app.platform] ?? app.platform}</td>
						<td class="py-3 pr-4">{statusLabel[app.status] ?? app.status}</td>
						<td class="py-3 pr-4">{app.published ? 'Yes' : 'No'}</td>
						<td class="py-3 pr-4">{app.featured ? 'Yes' : 'No'}</td>
						<td class="py-3">
							<div class="flex items-center justify-end gap-4">
								<a href="/apps/{app.slug}" class="text-link">View</a>
								<a href="/admin/apps/{app.id}" class="text-link">Edit</a>
								<form method="POST" action="?/delete" onsubmit={confirmDelete}>
									<input type="hidden" name="id" value={app.id} />
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
