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
		{
			title: "Project 3",
			author: "David Dyck",
			date: "2024-02-01",
			description: "Description for project 3 github link.",
			image: "https://www.horizonrealty.mx/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fhorizon-real-estate-30201.appspot.com%2Fo%2Fimages%252F.2b5d6e18-2ba8-4713-82e0-409bcf88f57e.jpg%3Falt%3Dmedia%26token%3Daa66ce7f-0a89-40fb-88ec-1b0230570a49&w=1920&q=75"
		},
		// Add more projects as needed
	];
</script>

<svelte:head>
	<title>David's Portfolio</title>
	<meta name="description" content="David's Portfolio site" />
</svelte:head>

<section class=" py-10">
	<h1 class="text-4xl font-bold text-center ">Projects</h1>
	<h3 class="text-4 font-bold text-center pt-10">No Project Yet</h3>
	<!-- <div class="max-w-4xl mx-auto mt-8 space-y-6 px-4">
		{#each projects as project}
			<div class="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
				<img src={project.image} alt={project.title} class="w-full h-48 object-cover rounded-md" />
				<h2 class="text-2xl font-semibold mt-2 text-gray-800 dark:text-white">{project.title}</h2>
				<p class="text-gray-600 dark:text-gray-400">By {project.author} on {project.date}</p>
				<p class="mt-2 text-gray-700 dark:text-gray-300">{project.description}</p>
			</div>
		{/each}
	</div> -->
</section>

