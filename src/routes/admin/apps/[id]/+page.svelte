<script lang="ts">
	import AppForm from '$lib/components/AppForm.svelte';
	import JsonImport from '$lib/components/JsonImport.svelte';
	import type { AppFormValues } from '$lib/server/apps';

	let { data, form } = $props();

	let values = $state({ ...(form?.values ?? data.values) });
	const slug = $derived(values.slug || data.app.slug);
	const privacyUrl = $derived(form?.privacyUrl ?? `/apps/${slug}/privacy`);

	function applyDraft(draft: Record<string, unknown>) {
		values = { ...values, ...(draft as AppFormValues) };
	}

	function confirmDelete(event: SubmitEvent) {
		if (!confirm('Delete this app? This cannot be undone.')) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>{data.app.name} — Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<p class="text-sm">
	<a href="/admin/apps" class="text-muted hover:text-ink">Apps</a>
	<span class="mx-2 text-muted">/</span>
	<span>Edit</span>
</p>
<h1 class="mt-2 font-serif text-3xl tracking-tight">Edit app</h1>
<p class="mt-3 max-w-xl text-sm leading-relaxed text-muted">
	Same four steps as a new app. After you publish, copy the privacy URL into App Store Connect.
</p>

{#if form?.saved}
	<p class="mt-6 border border-rule bg-surface px-3 py-2.5 text-sm" role="status">
		Saved. Public privacy URL:
		<a href={privacyUrl} class="text-link" target="_blank" rel="noopener noreferrer">{privacyUrl}</a>
	</p>
{/if}

<div class="mt-8 max-w-3xl">
	<JsonImport onapply={applyDraft} />
</div>

<AppForm bind:values error={form?.error} {privacyUrl} submitLabel="Save" action="?/save" />

<form method="POST" action="?/delete" class="mt-12 max-w-3xl border-t border-rule pt-6" onsubmit={confirmDelete}>
	<button type="submit" class="border border-rule px-4 py-2 text-sm text-danger hover:bg-surface">
		Delete app
	</button>
</form>
