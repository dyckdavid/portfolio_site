<script lang="ts">
	import { onMount } from 'svelte';

	let currentLevel = $state(1);
	let score = $state(0);
	let userInput = $state('');
	let terminalOutput = $state('');
	let gameStarted = $state(false);
	let gameCompleted = $state(false);
	let levelComplete = $state(false);
	let showHint = $state(false);
	let achievements = $state<string[]>([]);
	let attempts = $state(0);
	let totalAttempts = $state(0);
	let completionTime = $state(0);
	let startTime = $state(0);
	let highScore = $state(0);
	let isNewHighScore = $state(false);

	const levels = [
		{
			id: 1,
			name: 'TERMINAL_NAVIGATION',
			description: 'Find the hidden file in the system',
			challenge: '> Use terminal commands to locate the secret file\n> Hint: Try listing files and searching directories',
			correctCommands: ['ls', 'ls -la', 'find . -name secret.txt', 'cat secret.txt'],
			successMessage: '> File found! Contents: "LEVEL_1_COMPLETE"\n> Access granted to Level 2',
			hint: 'Try: ls, then find . -name secret.txt'
		},
		{
			id: 2,
			name: 'CAESAR_CIPHER',
			description: 'Decode the encrypted message',
			challenge: '> Encrypted message: "KHOOR ZRUOG"\n> This is a Caesar cipher with shift 3\n> Decode it to proceed',
			correctAnswer: 'HELLO WORLD',
			successMessage: '> Decryption successful!\n> Message decoded: "HELLO WORLD"\n> Access granted to Level 3',
			hint: 'Each letter is shifted by 3 positions. A->D, B->E, etc.'
		},
		{
			id: 3,
			name: 'BASE64_DECODE',
			description: 'Decode the base64 encoded string',
			challenge: '> Base64 string: "U0tJTEw="\n> Decode this to reveal the password',
			correctAnswer: 'SKILL',
			successMessage: '> Decoding successful!\n> Password revealed: "SKILL"\n> Access granted to Level 4',
			hint: 'Use base64 decoding. Online tools or atob() function can help.'
		},
		{
			id: 4,
			name: 'PASSWORD_CRACK',
			description: 'Crack the simple password',
			challenge: '> Password hash: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8\n> This is SHA-256. Try common passwords...',
			correctAnswer: 'password',
			successMessage: '> Password cracked!\n> Password: "password"\n> Access granted to Level 5',
			hint: 'Try common passwords: password, admin, 123456, etc.'
		},
		{
			id: 5,
			name: 'HEX_TO_ASCII',
			description: 'Convert hex to readable text',
			challenge: '> Hex string: "4861636b6572"\n> Convert this hex to ASCII text',
			correctAnswer: 'Hacker',
			successMessage: '> Conversion successful!\n> Text: "Hacker"\n> Access granted to Level 6',
			hint: 'Convert each pair of hex digits to ASCII. 48 = H, 61 = a, etc.'
		},
		{
			id: 6,
			name: 'FINAL_CHALLENGE',
			description: 'Combine all skills - Multi-step challenge',
			challenge: '> Step 1: Decode base64: "RmluZCB0aGUgc2VjcmV0"\n> Step 2: The decoded message is "Find the secret"\n> Step 3: Use terminal command to find secret file\n> Step 4: Read the file to get the final flag',
			correctCommands: ['find . -name secret', 'cat secret', 'FLAG_COMPLETE'],
			correctAnswer: 'FLAG_COMPLETE',
			successMessage: '> CONGRATULATIONS!\n> You have completed all challenges!\n> Final Flag: "FLAG_COMPLETE"\n> You are now a certified hacker!',
			hint: 'Decode base64: "RmluZCB0aGUgc2VjcmV0" = "Find the secret", then use find command'
		}
	];

	function startGame() {
		gameStarted = true;
		gameCompleted = false;
		currentLevel = 1;
		score = 0;
		attempts = 0;
		totalAttempts = 0;
		levelComplete = false;
		achievements = [];
		startTime = Date.now();
		terminalOutput = '> INITIALIZING HACKING SIMULATION...\n> SYSTEM READY\n> BEGIN CHALLENGE\n\n';
		loadLevel();
	}

	function loadLevel() {
		const level = levels[currentLevel - 1];
		levelComplete = false;
		showHint = false;
		userInput = '';
		terminalOutput += `\n> ========================================\n`;
		terminalOutput += `> LEVEL ${currentLevel}: ${level.name}\n`;
		terminalOutput += `> ${level.description}\n`;
		terminalOutput += `> ========================================\n\n`;
		terminalOutput += level.challenge + '\n\n';
		terminalOutput += `> Enter your answer/command:\n`;
	}

	function checkAnswer() {
		if (!userInput.trim()) return;

		attempts++;
		const level = levels[currentLevel - 1];
		let correct = false;

		// Level 1 & 6: Terminal commands
		if (currentLevel === 1 || currentLevel === 6) {
			const input = userInput.trim().toLowerCase();
			if (level.correctCommands) {
				correct = level.correctCommands.some(cmd => input.includes(cmd.toLowerCase()));
			}
			// For level 6, also accept the final flag directly
			if (currentLevel === 6 && !correct) {
				correct = input === level.correctAnswer.toLowerCase();
			}
		}
		// Other levels: Direct answer match
		else {
			correct = userInput.trim().toUpperCase() === level.correctAnswer.toUpperCase();
		}

		if (correct) {
			levelComplete = true;
			totalAttempts += attempts;
			const levelScore = Math.max(0, 100 - (attempts * 5)); // Prevent negative scores
			score += levelScore;

			terminalOutput += `\n> ${userInput}\n`;
			terminalOutput += level.successMessage + '\n\n';

			// Check for achievements
			checkAchievements();

			// Move to next level or complete game
			if (currentLevel < levels.length) {
				setTimeout(() => {
					currentLevel++;
					attempts = 0;
					loadLevel();
				}, 2000);
			} else {
				// Game completed!
				completionTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
				
				// Check for time-based achievement
				if (completionTime < 300 && !achievements.includes('Speed Demon')) {
					achievements.push('Speed Demon');
					terminalOutput += `> 🏆 ACHIEVEMENT UNLOCKED: Speed Demon\n`;
				}
				
				// Check and save high score
				const savedHighScore = localStorage.getItem('hackGameHighScore');
				const previousHighScore = savedHighScore ? parseInt(savedHighScore) : 0;
				highScore = previousHighScore;
				
				if (!savedHighScore || score > previousHighScore) {
					localStorage.setItem('hackGameHighScore', score.toString());
					localStorage.setItem('hackGameBestTime', completionTime.toString());
					isNewHighScore = true;
					highScore = score;
				} else {
					isNewHighScore = false;
				}
				
				gameCompleted = true;
				gameStarted = false;
			}
		} else {
			terminalOutput += `\n> ${userInput}\n`;
			terminalOutput += `> ERROR: Incorrect answer. Try again.\n`;
			terminalOutput += `> Attempts: ${attempts}\n\n`;
		}

		userInput = '';
	}

	function checkAchievements() {
		const newAchievements: string[] = [];

		if (currentLevel === 1 && !achievements.includes('First Steps')) {
			newAchievements.push('First Steps');
		}
		if (currentLevel === 3 && !achievements.includes('Code Breaker')) {
			newAchievements.push('Code Breaker');
		}
		if (currentLevel === 4 && !achievements.includes('Password Master')) {
			newAchievements.push('Password Master');
		}
		if (currentLevel === 6 && !achievements.includes('Elite Hacker')) {
			newAchievements.push('Elite Hacker');
		}
		if (attempts === 1 && !achievements.includes('Perfect Run')) {
			newAchievements.push('Perfect Run');
		}
		if (currentLevel === 6) {
			if (totalAttempts <= 6 && !achievements.includes('Flawless Victory')) {
				newAchievements.push('Flawless Victory');
			}
			if (score >= 500 && !achievements.includes('Master Hacker')) {
				newAchievements.push('Master Hacker');
			}
		}

		newAchievements.forEach(achievement => {
			achievements.push(achievement);
			terminalOutput += `> 🏆 ACHIEVEMENT UNLOCKED: ${achievement}\n`;
		});
	}

	function toggleHint() {
		if (!showHint) {
			const level = levels[currentLevel - 1];
			terminalOutput += `\n> HINT: ${level.hint}\n\n`;
			showHint = true;
		} else {
			// Hint already shown, just toggle the state
			showHint = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !levelComplete) {
			checkAnswer();
		}
	}

	// Helper function for level 6
	function decodeBase64(str: string): string {
		try {
			return atob(str);
		} catch {
			return '';
		}
	}

	onMount(() => {
		// Load saved progress
		const savedLevel = localStorage.getItem('hackGameLevel');
		const savedScore = localStorage.getItem('hackGameScore');
		if (savedLevel) {
			currentLevel = parseInt(savedLevel);
		}
		if (savedScore) {
			score = parseInt(savedScore);
		}
	});
</script>

<svelte:head>
	<title>Hack Challenge | David's Portfolio</title>
	<meta name="description" content="Try to hack the system - Interactive hacking game" />
</svelte:head>

<section class="min-h-screen bg-hacker-black text-hacker-green py-8 px-4">
	<div class="max-w-5xl mx-auto">
		<!-- Header -->
		<div class="border-2 border-hacker-green bg-hacker-dark p-6 mb-8 shadow-hacker-glow">
			<div class="font-mono text-2xl font-bold text-hacker-green mb-2">
				&gt; HACKING_SIMULATION v1.0
			</div>
			<div class="text-sm text-hacker-green-dark">
				// Test your hacking skills in this interactive challenge
			</div>
		</div>

		{#if gameCompleted}
			<!-- Completion/Award Screen -->
			<div class="border-2 border-hacker-green bg-hacker-dark p-8 shadow-hacker-glow">
				<div class="text-center mb-8">
					<div class="font-mono text-4xl font-bold text-hacker-green mb-4 animate-pulse">
						&gt; MISSION_COMPLETE
					</div>
					<div class="text-hacker-green-bright text-2xl mb-2">
						🎉 CONGRATULATIONS! 🎉
					</div>
					<div class="text-hacker-green-dark text-lg">
						You have successfully completed all hacking challenges!
					</div>
				</div>

				<!-- Stats -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<div class="border-2 border-hacker-green bg-hacker-black p-4">
						<div class="font-mono text-hacker-green mb-2">&gt; FINAL_SCORE</div>
						<div class="text-hacker-green-bright text-2xl font-bold">{score}</div>
						<div class="text-hacker-green-dark text-xs mt-1">points</div>
					</div>
					<div class="border-2 border-hacker-green bg-hacker-black p-4">
						<div class="font-mono text-hacker-green mb-2">&gt; TOTAL_ATTEMPTS</div>
						<div class="text-hacker-green-bright text-2xl font-bold">{totalAttempts}</div>
						<div class="text-hacker-green-dark text-xs mt-1">attempts</div>
					</div>
					<div class="border-2 border-hacker-green bg-hacker-black p-4">
						<div class="font-mono text-hacker-green mb-2">&gt; COMPLETION_TIME</div>
						<div class="text-hacker-green-bright text-2xl font-bold">{completionTime}s</div>
						<div class="text-hacker-green-dark text-xs mt-1">seconds</div>
					</div>
				</div>

				<!-- Achievements -->
				<div class="border-2 border-hacker-green bg-hacker-black p-6 mb-8">
					<div class="font-mono text-xl text-hacker-green mb-4 text-center">
						&gt; ACHIEVEMENTS_UNLOCKED: {achievements.length}
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{#each achievements as achievement}
							<div class="border border-hacker-green bg-hacker-dark p-3 flex items-center gap-2">
								<span class="text-2xl">🏆</span>
								<span class="text-hacker-green font-mono">{achievement}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Badge/Rank -->
				<div class="text-center mb-8">
					<div class="inline-block border-4 border-hacker-green bg-hacker-black p-8 shadow-hacker-glow">
						<div class="text-6xl mb-4">🛡️</div>
						<div class="font-mono text-2xl text-hacker-green mb-2">
							{#if score >= 500}
								ELITE HACKER
							{:else if score >= 400}
								EXPERT HACKER
							{:else if score >= 300}
								ADVANCED HACKER
							{:else if score >= 200}
								SKILLED HACKER
							{:else}
								CERTIFIED HACKER
							{/if}
						</div>
						<div class="text-hacker-green-dark text-sm">
							Rank based on performance
						</div>
					</div>
				</div>

				<!-- High Score -->
				{#if isNewHighScore}
					<div class="border-2 border-hacker-green-bright bg-hacker-black p-4 mb-6 text-center">
						<div class="font-mono text-hacker-green-bright text-lg animate-pulse">
							&gt; NEW HIGH SCORE!
						</div>
						<div class="text-hacker-green-dark text-sm mt-2">
							You beat your previous record!
						</div>
					</div>
				{:else if highScore > 0}
					<div class="border-2 border-hacker-green bg-hacker-black p-4 mb-6 text-center">
						<div class="font-mono text-hacker-green text-sm">
							&gt; PERSONAL_BEST: {highScore} points
						</div>
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						on:click={startGame}
						class="px-8 py-4 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono font-bold hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow"
					>
						[PLAY_AGAIN]
					</button>
					<a
						href="/"
						class="px-8 py-4 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono font-bold hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow text-center"
					>
						[BACK_TO_HOME]
					</a>
				</div>
			</div>
		{:else if !gameStarted}
			<!-- Start Screen -->
			<div class="border-2 border-hacker-green bg-hacker-dark p-8 text-center shadow-hacker">
				<div class="font-mono text-xl text-hacker-green mb-6">
					&gt; WELCOME_TO_HACKING_SIMULATION
				</div>
				<div class="text-hacker-green-dark mb-8 space-y-2 text-left max-w-2xl mx-auto">
					<div>// Challenge yourself with 6 levels of hacking puzzles</div>
					<div>// Terminal commands, code breaking, password cracking</div>
					<div>// Earn achievements and compete for the highest score</div>
					<div>// Educational and fun - learn security concepts</div>
				</div>
				<button
					on:click={startGame}
					class="px-8 py-4 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono font-bold text-lg hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow"
				>
					[START_HACKING]
				</button>
			</div>
		{:else}
			<!-- Game Interface -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Main Terminal -->
				<div class="lg:col-span-2 border-2 border-hacker-green bg-hacker-dark p-6 shadow-hacker">
					<div class="font-mono text-sm leading-relaxed whitespace-pre-wrap min-h-[500px] max-h-[600px] overflow-y-auto terminal-scroll">
						{terminalOutput}
						{#if levelComplete}
							<span class="text-hacker-green-bright animate-pulse">█</span>
						{:else}
							<span class="text-hacker-green-bright">root@hack:~$ </span>
							<span class="terminal-cursor">{userInput}</span>
						{/if}
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-4">
					<!-- Level Info -->
					<div class="border-2 border-hacker-green bg-hacker-dark p-4 shadow-hacker">
						<div class="font-mono text-sm">
							<div class="text-hacker-green mb-2">&gt; LEVEL_INFO</div>
							<div class="text-hacker-green-dark">
								<div>Current: {currentLevel} / {levels.length}</div>
								<div>Score: {score}</div>
								<div>Attempts: {attempts}</div>
							</div>
						</div>
					</div>

					<!-- Input -->
					<div class="border-2 border-hacker-green bg-hacker-dark p-4 shadow-hacker">
						<div class="font-mono text-sm mb-2 text-hacker-green">
							&gt; INPUT
						</div>
						<input
							type="text"
							bind:value={userInput}
							on:keypress={handleKeyPress}
							disabled={levelComplete}
							class="w-full bg-hacker-black border-2 border-hacker-green p-2 text-hacker-green font-mono text-sm focus:outline-none focus:border-hacker-green-bright focus:shadow-hacker-glow disabled:opacity-50"
							placeholder="Type command/answer..."
						/>
						<button
							on:click={checkAnswer}
							disabled={levelComplete || !userInput.trim()}
							class="w-full mt-2 px-4 py-2 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono hover:bg-hacker-green hover:text-hacker-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							[SUBMIT]
						</button>
					</div>

					<!-- Actions -->
					<div class="border-2 border-hacker-green bg-hacker-dark p-4 shadow-hacker">
						<div class="font-mono text-sm mb-2 text-hacker-green">
							&gt; ACTIONS
						</div>
						<button
							on:click={toggleHint}
							class="w-full mb-2 px-4 py-2 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono hover:bg-hacker-green hover:text-hacker-black transition-all text-xs"
						>
							[TOGGLE_HINT]
						</button>
					</div>

					<!-- Achievements -->
					{#if achievements.length > 0}
						<div class="border-2 border-hacker-green bg-hacker-dark p-4 shadow-hacker">
							<div class="font-mono text-sm mb-2 text-hacker-green">
								&gt; ACHIEVEMENTS
							</div>
							<div class="space-y-1">
								{#each achievements as achievement}
									<div class="text-hacker-green-dark text-xs">
										🏆 {achievement}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.terminal-scroll {
		font-family: 'Fira Mono', 'Courier New', monospace;
	}

	.terminal-cursor::after {
		content: '_';
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}

	.terminal-scroll::-webkit-scrollbar {
		width: 8px;
	}

	.terminal-scroll::-webkit-scrollbar-track {
		background: var(--hacker-black);
	}

	.terminal-scroll::-webkit-scrollbar-thumb {
		background: var(--hacker-green);
	}
</style>

