<script lang="ts">
	let {
		html = '',
		class: className = ''
	}: {
		html?: string;
		class?: string;
	} = $props();
</script>

{#if html}
	<div class="markdown-body {className}">
		{@html html}
	</div>
{/if}
