<script lang="ts">
	// Sample project data
	const projects = [
		{
			title: "Project 1",
			author: "Author 1",
			date: "2023-01-01",
			description: "Description for project 1.",
			image: "https://www.sitesaga.com/storage/2020/04/what-is-website-how-it-works.png",
		},
		{
			title: "Project 2",
			author: "Author 2",
			date: "2023-02-01",
			description: "Description for project 2.",
			image: "https://www.sitesaga.com/storage/2020/04/what-is-website-how-it-works.png"
		},
		// Add more projects as needed
	];
</script>

<svelte:head>
	<title>David's Portfolio</title>
	<meta name="description" content="David's Portfolio site" />
</svelte:head>

<section class="bg-gray-100 dark:bg-gray-800 py-10">
	<h1 class="text-4xl font-bold text-center text-gray-800 dark:text-white">Projects</h1>
	<div class="max-w-4xl mx-auto mt-8 space-y-6 px-4">
		{#each projects as project}
			<div class="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
				<img src={project.image} alt={project.title} class="w-full h-48 object-cover rounded-md" />
				<h2 class="text-2xl font-semibold mt-2 text-gray-800 dark:text-white">{project.title}</h2>
				<p class="text-gray-600 dark:text-gray-400">By {project.author} on {project.date}</p>
				<p class="mt-2 text-gray-700 dark:text-gray-300">{project.description}</p>
			</div>
		{/each}
	</div>
</section>

