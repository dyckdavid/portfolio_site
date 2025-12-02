<script lang="ts">
	const skillCategories = [
		{
			name: 'FRONTEND',
			skills: [
				{ name: 'HTML5', level: 95 },
				{ name: 'CSS3', level: 80 },
				{ name: 'JavaScript', level: 90 },
				{ name: 'TypeScript', level: 90 },
				{ name: 'Svelte', level: 90 },
				{ name: 'React', level: 80 },
				{ name: 'Tailwind CSS', level: 92 },
			]
		},
		{
			name: 'BACKEND',
			skills: [
				{ name: 'Node.js', level: 85 },
				{ name: 'Python', level: 82 },
				{ name: 'POSTGRESQL', level: 60 },
				{ name: 'REST APIs', level: 30 },
				{ name: 'Database Design', level: 80 },
			]
		},
		{
			name: 'TOOLS & TECH',
			skills: [
				{ name: 'Git', level: 90 },
				{ name: 'Linux', level: 80 },
				{ name: 'macOS', level: 100 },
				{ name: 'Windows', level: 100 },
				{ name: 'VS Code', level: 92 },
				{ name: 'Docker', level: 65 },
			]
		}
	];

	function getSkillBar(level: number) {
		const bars = Math.floor(level / 10);
		return '█'.repeat(bars) + '░'.repeat(10 - bars);
	}
</script>

<svelte:head>
	<title>Skills | David's Portfolio</title>
	<meta name="description" content="David's Technical Skills" />
	<link rel="manifest" href="/manifest.json">
</svelte:head>

<section class="min-h-screen bg-hacker-black text-hacker-green py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="border-2 border-hacker-green bg-hacker-dark p-6 mb-8 shadow-hacker-glow">
			<div class="font-mono text-2xl font-bold text-hacker-green">
				&gt; SKILLS_INVENTORY
			</div>
			<div class="text-sm text-hacker-green-dark mt-2">
				// Loading technical capabilities...
			</div>
		</div>

		<!-- Skills Grid -->
		<div class="space-y-6">
			{#each skillCategories as category}
				<div class="border-2 border-hacker-green bg-hacker-dark p-6 shadow-hacker">
					<div class="font-mono font-bold text-xl text-hacker-green mb-6">
						&gt; {category.name}
					</div>
					
					<div class="space-y-4">
						{#each category.skills as skill}
							<div class="font-mono">
								<div class="flex items-center justify-between mb-1">
									<span class="text-hacker-green-bright">{skill.name}</span>
									<span class="text-hacker-green-dark text-sm">{skill.level}%</span>
								</div>
								<div class="text-hacker-green text-xs">
									[{getSkillBar(skill.level)}]
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Additional Info -->
		<div class="mt-8 border-2 border-hacker-green bg-hacker-dark p-6">
			<div class="font-mono text-sm">
				<div class="text-hacker-green mb-4">&gt; ADDITIONAL_INFO</div>
				<div class="text-hacker-green-dark space-y-2 text-sm">
					<div>// Always learning new technologies</div>
					<div>// Passionate about clean code and best practices</div>
					<div>// Experience with cross-platform development</div>
					<div>// Focus on performance and user experience</div>
				</div>
			</div>
		</div>
	</div>
</section>

