<script lang="ts">
	import { db } from '../../lib/firebase';
	import { collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	let projects: any[] = [];
	let loading = true;

	async function fetchProjects() {
		const querySnapshot = await getDocs(collection(db, "projects"));
		projects = querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		// Sort projects by date (newest first)
        projects.sort((a, b) => {
            const dateA = a.date.toDate(); // Convert Firestore Timestamp to Date
            const dateB = b.date.toDate();
            return dateB - dateA; // Sort in descending order
        });

        loading = false;
	}

	onMount(() => {
		fetchProjects();
	});

	function formatDate(timestamp: { toDate: () => { (): any; new(): any; toLocaleDateString: { (): any; new(): any; }; }; }) {
        return timestamp.toDate().toLocaleDateString(); // Format to a readable date string
    }
</script>

<svelte:head>
	<title>Projects | David's Portfolio</title>
	<meta name="description" content="David's Portfolio Projects" />
	<link rel="manifest" href="/manifest.json">
</svelte:head>

<section class="min-h-screen bg-hacker-black text-hacker-green py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="border-2 border-hacker-green bg-hacker-dark p-6 mb-8 shadow-hacker-glow">
			<div class="font-mono text-2xl font-bold text-hacker-green">
				&gt; PROJECTS_DIRECTORY
			</div>
			<div class="text-sm text-hacker-green-dark mt-2">
				// Fetching project data from database...
			</div>
		</div>

		{#if loading}
			<div class="border-2 border-hacker-green bg-hacker-dark p-8 text-center">
				<div class="font-mono text-hacker-green">
					&gt; LOADING_PROJECTS...
				</div>
				<div class="mt-4 flex justify-center gap-2">
					<div class="w-2 h-2 bg-hacker-green rounded-full animate-pulse"></div>
					<div class="w-2 h-2 bg-hacker-green rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
					<div class="w-2 h-2 bg-hacker-green rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
				</div>
			</div>
		{:else if projects.length === 0}
			<div class="border-2 border-hacker-green bg-hacker-dark p-8 text-center">
				<div class="font-mono text-hacker-green text-xl">
					&gt; NO_PROJECTS_FOUND
				</div>
				<div class="text-hacker-green-dark mt-4">
					// Database query returned empty result
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each projects as project, index}
					<div 
						class="border-2 border-hacker-green bg-hacker-dark p-6 hover:shadow-hacker-glow transition-all group"
						style="animation-delay: {index * 0.1}s"
					>
						<!-- Project Header -->
						<div class="flex items-start justify-between mb-4">
							<div class="font-mono font-bold text-xl text-hacker-green group-hover:text-hacker-green-bright transition-colors">
								&gt; {project.title.toUpperCase()}
							</div>
							<div class="text-xs text-hacker-green-dark font-mono">
								#{String(index + 1).padStart(3, '0')}
							</div>
						</div>

						<!-- Project Meta -->
						<div class="text-xs text-hacker-green-dark font-mono mb-3 border-l-2 border-hacker-green pl-3">
							<div>AUTHOR: {project.author}</div>
							<div>DATE: {formatDate(project.date)}</div>
						</div>

						<!-- Project Description -->
						<div class="text-sm text-hacker-green-dark mb-4 leading-relaxed">
							{project.description}
						</div>

						<!-- Project Links -->
						<div class="flex flex-wrap gap-2 mt-4">
							{#if project.website}
								<a 
									href={project.website} 
									target="_blank" 
									rel="noopener noreferrer" 
									class="px-4 py-2 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono text-xs hover:bg-hacker-green hover:text-hacker-black transition-all"
								>
									[VISIT SITE]
								</a>
							{/if}
							{#if project.github}
								<a 
									href={project.github} 
									target="_blank" 
									rel="noopener noreferrer" 
									class="px-4 py-2 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono text-xs hover:bg-hacker-green hover:text-hacker-black transition-all"
								>
									[VIEW CODE]
								</a>
							{/if}
						</div>

						<!-- Terminal-style footer -->
						<div class="mt-4 pt-3 border-t border-hacker-green-dark text-xs text-hacker-green-dark font-mono">
							STATUS: <span class="text-hacker-green">ACTIVE</span>
						</div>
					</div>
				{/each}
			</div>

			<!-- Footer Stats -->
			<div class="mt-8 border-2 border-hacker-green bg-hacker-dark p-6">
				<div class="font-mono text-sm">
					<div class="text-hacker-green mb-2">&gt; PROJECT_STATISTICS</div>
					<div class="text-hacker-green-dark space-y-1">
						<div>TOTAL_PROJECTS: <span class="text-hacker-green">{projects.length}</span></div>
						<div>LAST_UPDATE: <span class="text-hacker-green">{new Date().toLocaleDateString()}</span></div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

