<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	const links = [
		{ href: '/projects', label: 'Work' },
		{ href: '/apps', label: 'Apps' },
		{ href: '/about', label: 'About' },
		{ href: '/skills', label: 'Skills' },
		{ href: '/contact', label: 'Contact' }
	];

	let menuOpen = $state(false);

	const pathname = $derived($page.url.pathname.replace(/\/+$/, '') || '/');

	$effect(() => {
		void pathname;
		menuOpen = false;
	});

	function isActive(href: string) {
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeMenu();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<nav class="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
	<div class="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-4 sm:px-6">
		<a
			href="/"
			class="font-serif text-lg font-semibold tracking-tight text-ink"
			title="Home"
			onclick={closeMenu}
		>
			David Dyck
		</a>

		<div class="flex items-center gap-1 sm:gap-3">
			<ul class="hidden items-center gap-7 md:flex">
				{#each links as link}
					<li>
						<a
							href={link.href}
							class="border-b pb-0.5 text-sm transition-colors {isActive(link.href)
								? 'border-accent text-ink'
								: 'border-transparent text-muted hover:text-ink'}"
							aria-current={isActive(link.href) ? 'page' : undefined}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>

			<ThemeToggle />

			<button
				type="button"
				class="inline-flex h-9 w-9 items-center justify-center text-ink hover:bg-surface md:hidden"
				aria-controls="mobile-menu"
				aria-expanded={menuOpen}
				onclick={toggleMenu}
			>
				<span class="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
				{#if menuOpen}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	{#if menuOpen}
		<div id="mobile-menu" class="border-t border-rule md:hidden">
			<ul class="mx-auto max-w-[1080px] px-4 py-3 sm:px-6">
				{#each links as link}
					<li>
						<a
							href={link.href}
							class="block py-3 text-sm {isActive(link.href)
								? 'text-ink'
								: 'text-muted hover:text-ink'}"
							aria-current={isActive(link.href) ? 'page' : undefined}
							onclick={closeMenu}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</nav>
