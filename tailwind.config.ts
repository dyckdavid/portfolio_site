import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				paper: 'rgb(var(--paper) / <alpha-value>)',
				ink: 'rgb(var(--ink) / <alpha-value>)',
				muted: 'rgb(var(--muted) / <alpha-value>)',
				rule: 'rgb(var(--rule) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
				'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
				surface: 'rgb(var(--surface) / <alpha-value>)',
				danger: 'rgb(var(--danger) / <alpha-value>)'
			},
			fontFamily: {
				serif: ['Source Serif 4', 'Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
				sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
				mono: ['IBM Plex Mono', 'ui-monospace', 'monospace']
			}
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
} as Config;
