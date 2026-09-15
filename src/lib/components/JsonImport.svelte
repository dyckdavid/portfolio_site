<script lang="ts">
	import { parseAppImportJson } from '$lib/import-json';

	let { onapply }: { onapply: (draft: Record<string, unknown>) => void } = $props();

	let error = $state('');
	let note = $state('');
	let paste = $state('');
	let fileInput: HTMLInputElement | undefined = $state();

	function applyText(raw: string, source: string) {
		error = '';
		note = '';
		const result = parseAppImportJson(raw);
		if ('error' in result) {
			error = result.error;
			return;
		}
		onapply(result.values);
		note = `Filled from ${source}. Nothing is saved until you submit the form.`;
		paste = '';
		if (fileInput) fileInput.value = '';
	}

	async function onFile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		try {
			applyText(await file.text(), file.name);
		} catch {
			error = 'Could not read that file.';
		}
	}

	function onPaste(event: SubmitEvent) {
		event.preventDefault();
		applyText(paste, 'pasted JSON');
	}
</script>

<div class="mb-10 border border-rule bg-surface p-5 sm:p-6">
	<p class="font-serif text-xl tracking-tight">Upload app JSON</p>
	<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
		Fill a <code class="font-mono">.json</code> file for this app and drop it here, or paste it.
		Listing and privacy fields update. Review them, then save.
	</p>

	<p class="mt-3 text-sm">
		Try a sample:
		<a href="/samples/app.json" class="text-link" download>download app JSON</a>
		<span class="text-muted"> · </span>
		<a href="/samples/app-with-data.json" class="text-link" download>sample with data types</a>
	</p>

	<label class="mt-5 block">
		<span class="mb-1.5 block text-sm">JSON file</span>
		<input
			bind:this={fileInput}
			type="file"
			accept="application/json,.json"
			onchange={onFile}
			class="block w-full text-sm text-muted file:mr-3 file:rounded-none file:border file:border-rule file:bg-paper file:px-3 file:py-1.5 file:text-ink"
		/>
	</label>

	<form onsubmit={onPaste} class="mt-5">
		<label for="json-paste-app" class="mb-1.5 block text-sm">Or paste JSON</label>
		<textarea
			id="json-paste-app"
			bind:value={paste}
			rows="6"
			class="w-full rounded-none border border-rule bg-paper px-3 py-2.5 font-mono text-xs text-ink placeholder:text-muted"
			placeholder={'{\n  "kind": "app",\n  "name": ""\n}'}
		></textarea>
		<button type="submit" class="btn-primary mt-3">Fill app form</button>
	</form>

	{#if note}
		<p class="mt-3 text-sm text-muted" role="status">{note}</p>
	{/if}
	{#if error}
		<p class="mt-3 text-sm text-danger" role="alert">{error}</p>
	{/if}
</div>
