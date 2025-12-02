import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'hacker-green': '#00ff00',
        'hacker-green-dark': '#00cc00',
        'hacker-green-bright': '#00ff41',
        'hacker-black': '#000000',
        'hacker-dark': '#0a0a0a',
        'hacker-gray': '#1a1a1a',
      },
      fontFamily: {
        'mono': ['Fira Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'hacker': '0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3)',
        'hacker-glow': '0 0 5px rgba(0, 255, 0, 0.8), 0 0 10px rgba(0, 255, 0, 0.6), 0 0 15px rgba(0, 255, 0, 0.4)',
      },
      animation: {
        'glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },

  plugins: [typography, forms, containerQueries, aspectRatio]
} as Config;
