<script lang="ts">
	import { onMount } from 'svelte';
	import {
		applyTheme,
		currentTheme,
		readStoredTheme,
		toggleTheme,
		type Theme
	} from '$lib/theme';

	let theme = $state<Theme>('light');

	onMount(() => {
		theme = currentTheme();

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const onSystemChange = (event: MediaQueryListEvent) => {
			if (readStoredTheme()) return;
			const next: Theme = event.matches ? 'dark' : 'light';
			applyTheme(next, false);
			theme = next;
		};

		media.addEventListener('change', onSystemChange);
		return () => media.removeEventListener('change', onSystemChange);
	});

	function onToggle() {
		theme = toggleTheme();
	}
</script>

<button
	type="button"
	class="inline-flex h-9 w-9 items-center justify-center text-ink hover:bg-surface"
	aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	aria-pressed={theme === 'dark'}
	title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
	onclick={onToggle}
>
	{#if theme === 'dark'}
		<svg class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5M6.16 6.16 5.11 5.11m13.73 13.73-1.05-1.05M17.84 6.16l1.05-1.05M6.16 17.84l-1.05 1.05M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
			/>
		</svg>
	{:else}
		<svg class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
			/>
		</svg>
	{/if}
</button>
