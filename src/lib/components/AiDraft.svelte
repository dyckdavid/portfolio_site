<script lang="ts">
	let {
		kind,
		onapply
	}: {
		kind: 'project' | 'app';
		onapply: (draft: Record<string, unknown>) => void;
	} = $props();

	let prompt = $state('');
	let busy = $state(false);
	let error = $state('');
	let model = $state('');

	const noun = $derived(kind === 'app' ? 'app' : 'project');

	async function generate(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		busy = true;
		try {
			const response = await fetch('/admin/ai/draft', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ kind, prompt })
			});
			const data = (await response.json()) as {
				error?: string;
				model?: string;
				project?: Record<string, unknown>;
				app?: Record<string, unknown>;
			};
			if (!response.ok || data.error) {
				error = data.error ?? 'Draft failed.';
				return;
			}
			const draft = kind === 'app' ? data.app : data.project;
			if (!draft) {
				error = 'The model returned an empty draft.';
				return;
			}
			model = data.model ?? '';
			onapply(draft);
		} catch {
			error = 'Could not reach the draft endpoint.';
		} finally {
			busy = false;
		}
	}
</script>

<form
	onsubmit={generate}
	class="mb-10 border border-rule bg-surface p-5 sm:p-6"
>
	<p class="font-serif text-xl tracking-tight">Draft with Grok</p>
	<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
		Describe the {noun} in plain language — what it is, stack, who it was for, what data it
		touches. The form below fills in. Review it before you save.
	</p>
	<label for="ai-prompt-{kind}" class="sr-only">Prompt</label>
	<textarea
		id="ai-prompt-{kind}"
		bind:value={prompt}
		rows="5"
		required
		minlength="12"
		disabled={busy}
		placeholder={kind === 'app'
			? 'Habit timer for iOS. Local reminders only, no account, no analytics. Category: Productivity. Still in development.'
			: 'Client billing dashboard. I did the full product. Shipped 2025. No public repo.'}
		class="mt-4 w-full rounded-none border border-rule bg-paper px-3 py-2.5 text-ink placeholder:text-muted disabled:opacity-60"
	></textarea>
	<div class="mt-4 flex flex-wrap items-center gap-4">
		<button type="submit" class="btn-primary" disabled={busy}>
			{busy ? 'Drafting…' : `Fill ${noun} form`}
		</button>
		{#if model}
			<p class="text-xs text-muted">Filled with {model}. Nothing is saved until you submit the form.</p>
		{/if}
	</div>
	{#if error}
		<p class="mt-3 text-sm text-danger" role="alert">{error}</p>
	{/if}
</form>
