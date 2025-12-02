<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let displayText = '';
	let currentIndex = 0;
	let showCursor = true;
	let mounted = false;
	const fullText = "> INITIALIZING SYSTEM...\n> LOADING PORTFOLIO...\n> CONNECTION ESTABLISHED\n\n> WELCOME TO DAVID DYCK'S TERMINAL\n> FULL-STACK SOFTWARE DEVELOPER\n> SPECIALIZING IN WEB DEVELOPMENT\n\n> STATUS: AVAILABLE FOR PROJECTS\n> OS: macOS | Windows | Linux\n> LOCATION: REMOTE\n\n> TYPE 'help' FOR COMMANDS";

	let typeInterval: ReturnType<typeof setInterval> | null = null;
	let cursorInterval: ReturnType<typeof setInterval> | null = null;

	function typeNextChar() {
		if (!mounted || currentIndex >= fullText.length) {
			if (typeInterval) {
				clearInterval(typeInterval);
				typeInterval = null;
			}
			return;
		}
		
		displayText = fullText.slice(0, currentIndex + 1);
		currentIndex++;
	}

	onMount(() => {
		mounted = true;
		
		// Typing animation - use async function to ensure proper DOM updates
		typeInterval = setInterval(() => {
			typeNextChar();
		}, 30);

		// Cursor blink - only start after a short delay to ensure DOM is ready
		setTimeout(() => {
			if (mounted) {
				cursorInterval = setInterval(() => {
					if (mounted) {
						showCursor = !showCursor;
					}
				}, 530);
			}
		}, 200);
	});

	onDestroy(() => {
		mounted = false;
		if (typeInterval) {
			clearInterval(typeInterval);
			typeInterval = null;
		}
		if (cursorInterval) {
			clearInterval(cursorInterval);
			cursorInterval = null;
		}
	});
</script>

<svelte:head>
	<title>David's Portfolio | Terminal</title>
	<meta name="description" content="David Dyck - Full-Stack Developer Portfolio" />
	<link rel="manifest" href="/manifest.json">
</svelte:head>

<section class="min-h-screen bg-hacker-black text-hacker-green p-4 sm:p-8">
	<div class="max-w-4xl mx-auto">
		<!-- Terminal Window -->
		<div class="border-2 border-hacker-green shadow-hacker-glow bg-hacker-dark p-6 font-mono">
			<!-- Terminal Header -->
			<div class="flex items-center justify-between mb-4 pb-2 border-b border-hacker-green">
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 bg-red-500 rounded-full"></div>
					<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
					<div class="w-3 h-3 bg-hacker-green rounded-full"></div>
					<span class="ml-4 text-hacker-green text-sm">TERMINAL v2.0</span>
				</div>
				<span class="text-hacker-green-dark text-xs">root@portfolio:~$</span>
			</div>

			<!-- Terminal Content -->
			<div class="terminal-output text-sm leading-relaxed whitespace-pre-wrap">
				<span>{displayText}</span><span class="terminal-cursor">{mounted && showCursor ? '_' : ' '}</span>
			</div>

			<!-- Command Prompt -->
			<div class="mt-4 flex items-center">
				<span class="text-hacker-green">root@portfolio:~$</span>
				<span class="ml-2 text-hacker-green-bright animate-pulse">█</span>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
			<a href="/projects" class="group">
				<div class="border-2 border-hacker-green bg-hacker-dark p-6 hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow">
					<div class="font-mono font-bold text-lg mb-2">&gt; VIEW PROJECTS</div>
					<div class="text-sm text-hacker-green-dark group-hover:text-hacker-black">
						Browse my latest work and contributions
					</div>
				</div>
			</a>

			<a href="/skills" class="group">
				<div class="border-2 border-hacker-green bg-hacker-dark p-6 hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow">
					<div class="font-mono font-bold text-lg mb-2">&gt; MY SKILLS</div>
					<div class="text-sm text-hacker-green-dark group-hover:text-hacker-black">
						Technologies and tools I work with
					</div>
				</div>
			</a>

			<a href="/contact" class="group">
				<div class="border-2 border-hacker-green bg-hacker-dark p-6 hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow">
					<div class="font-mono font-bold text-lg mb-2">&gt; CONTACT ME</div>
					<div class="text-sm text-hacker-green-dark group-hover:text-hacker-black">
						Let's collaborate on your next project
					</div>
				</div>
			</a>

			<a href="/hack" class="group">
				<div class="border-2 border-hacker-green bg-hacker-dark p-6 hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow">
					<div class="font-mono font-bold text-lg mb-2">&gt; HACK CHALLENGE</div>
					<div class="text-sm text-hacker-green-dark group-hover:text-hacker-black">
						Test your hacking skills in an interactive game
					</div>
				</div>
			</a>
		</div>

		<!-- About Section -->
		<div class="mt-8 border-2 border-hacker-green bg-hacker-dark p-6 shadow-hacker">
			<div class="font-mono font-bold text-xl mb-4 text-hacker-green">&gt; ABOUT_ME.txt</div>
			<div class="text-sm leading-relaxed space-y-2">
				<p class="text-hacker-green-dark">// Full-stack software developer with experience across multiple platforms</p>
				<p class="mt-4">I'm <span class="text-hacker-green-bright font-bold">David Dyck</span>, a passionate developer who creates innovative web solutions.</p>
				<p>With expertise spanning <span class="text-hacker-green-bright">macOS</span>, <span class="text-hacker-green-bright">Windows</span>, and <span class="text-hacker-green-bright">Linux</span>, I bring cross-platform knowledge to every project.</p>
				<p class="mt-4 text-hacker-green-dark">// Always learning, always building</p>
			</div>
		</div>
	</div>
</section>

<style>
	.terminal-output {
		min-height: 300px;
		font-family: 'Fira Mono', 'Courier New', monospace;
	}

	.terminal-cursor {
		display: inline-block;
		min-width: 1ch;
	}
	
	
</style>

