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

	console.log(projects);

	onMount(() => {
		fetchProjects();
	});

	function formatDate(timestamp: { toDate: () => { (): any; new(): any; toLocaleDateString: { (): any; new(): any; }; }; }) {
        return timestamp.toDate().toLocaleDateString(); // Format to a readable date string
    }
</script>

<svelte:head>
	<title>David's Portfolio</title>
	<meta name="description" content="David's Portfolio site" />
	<link rel="manifest" href="/manifest.json">
</svelte:head>

<section class="py-10">
    <h1 class="text-4xl font-bold text-center">Projects</h1>
    {#if loading}
        <h3 class="text-4 font-bold text-center pt-10">Loading projects...</h3>
    {:else if projects.length === 0}
        <h3 class="text-4 font-bold text-center pt-10">No Project Yet</h3>
    {:else}
        <div class="max-w-4xl mx-auto mt-8 space-y-6 px-4">
            {#each projects as project}
                <div class="border border-gray-300 bg-white p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
                    <h2 class="text-2xl font-semibold mt-2 text-gray-800 ">{project.title}</h2>
                    <p class="text-gray-600 dark:text-gray-400">By {project.author} on {formatDate(project.date)}</p>
                    <p class="mt-2 text-gray-700 dark:text-gray-500">{project.description}</p>
                    
                    <div class="mt-4">
                        {#if project.website}
                            <a href={project.website} target="_blank" rel="noopener noreferrer" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                                Visit Website
                            </a>
                        {/if}
                        {#if project.github}
                            <a href={project.github} target="_blank" rel="noopener noreferrer" class="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition ml-2">
                                View on GitHub
                            </a>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</section>

