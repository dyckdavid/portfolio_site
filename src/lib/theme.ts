import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
export const LIGHT_THEME_COLOR = '#f6f3ee';
export const DARK_THEME_COLOR = '#161412';

export function readStoredTheme(): Theme | null {
	if (!browser) return null;
	const value = localStorage.getItem(STORAGE_KEY);
	return value === 'light' || value === 'dark' ? value : null;
}

export function currentTheme(): Theme {
	if (!browser) return 'light';
	return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function applyTheme(theme: Theme, persist: boolean) {
	if (!browser) return;
	document.documentElement.classList.toggle('dark', theme === 'dark');
	document.documentElement.style.colorScheme = theme;
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute('content', theme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
	}
	if (persist) localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme(): Theme {
	const next = currentTheme() === 'dark' ? 'light' : 'dark';
	applyTheme(next, true);
	return next;
}
