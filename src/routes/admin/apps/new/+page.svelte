<script lang="ts">
	import AiDraft from '$lib/components/AiDraft.svelte';
	import AppForm from '$lib/components/AppForm.svelte';
	import JsonImport from '$lib/components/JsonImport.svelte';
	import type { AppFormValues } from '$lib/server/apps';

	let { data, form } = $props();

	let values = $state<AppFormValues>({ ...(form?.values ?? data.values) });

	function applyDraft(draft: Record<string, unknown>) {
		values = { ...values, ...(draft as AppFormValues) };
	}
</script>

<svelte:head>
	<title>New app — Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<p class="text-sm">
	<a href="/admin/apps" class="text-muted hover:text-ink">Apps</a>
	<span class="mx-2 text-muted">/</span>
	<span>New</span>
</p>
<h1 class="mt-2 font-serif text-3xl tracking-tight">New app</h1>
<p class="mt-3 max-w-xl text-sm leading-relaxed text-muted">
	Upload a JSON file, draft with Grok, or fill the four steps by hand. Name is the only required
	field. Empty is fine everywhere else.
</p>

<div class="mt-8 max-w-3xl">
	<JsonImport onapply={applyDraft} />
	<AiDraft kind="app" onapply={applyDraft} />
</div>

<AppForm bind:values error={form?.error} submitLabel="Create app" />
