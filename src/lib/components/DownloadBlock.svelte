<script lang="ts">
	let {
		downloadUrl,
		sha256 = null,
		version = null,
		fileSize = null,
		requirements = null
	}: {
		downloadUrl: string;
		sha256?: string | null;
		version?: string | null;
		fileSize?: string | null;
		requirements?: string | null;
	} = $props();

	let copied = $state(false);

	const meta = $derived(
		[
			version ? `Version ${version}` : null,
			fileSize ? `Size ${fileSize}` : null,
			requirements ? `Requires ${requirements}` : null
		].filter(Boolean) as string[]
	);

	async function copyChecksum() {
		if (!sha256) return;
		try {
			await navigator.clipboard.writeText(sha256);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			copied = false;
		}
	}
</script>

<div class="mt-12 max-w-2xl border-t border-rule pt-10">
	<div class="flex flex-wrap items-center gap-3">
		<a href={downloadUrl} class="btn-primary" target="_blank" rel="noopener noreferrer">Download</a>
		{#if meta.length}
			<p class="font-mono text-sm text-muted">{meta.join(' · ')}</p>
		{/if}
	</div>

	{#if sha256}
		<div class="mt-4 flex flex-wrap items-start gap-3">
			<p class="min-w-0 break-all font-mono text-sm leading-relaxed">
				<span class="text-muted">SHA-256</span>
				<span class="ml-2">{sha256}</span>
			</p>
			<button type="button" class="shrink-0 text-sm text-link" onclick={copyChecksum}>
				{copied ? 'Copied' : 'Copy'}
			</button>
		</div>
	{/if}
</div>
