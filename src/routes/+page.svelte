<script lang="ts">

</script>

<svelte:head>
	<title>David's Portfolio</title>
	<meta name="description" content="David's Portfolio site" />
	<link rel="manifest" href="/manifest.json">
</svelte:head>

<section>
	<h1 class="text-4xl font-bold pt-10 text-center">David's Portfolio</h1>
	<h2 class="about-me text-3xl font-mono text-center mt-10 pt-5">About Me: I'm David Dyck, a full-stack software developer. I've created various websites and have experience with macOS, Windows, and Linux.</h2>
	<a href="/projects">
		<button class="project-button">View My Projects</button>
	</a>
</section>

<style>
	.project-button {
		display: block;
		margin: 20px auto;
		padding: 10px 20px;
		font-size: 1.5rem;
		color: white;
		background: linear-gradient(45deg, #6a11cb, #2575fc);
		border: none;
		border-radius: 5px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s, box-shadow 0.3s;
	}

	.project-button:hover {
		transform: scale(1.05);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
	}

	.about-me {
		max-width: 600px;
		margin: 0 auto;
		padding: 5 20px;
	}
</style>

