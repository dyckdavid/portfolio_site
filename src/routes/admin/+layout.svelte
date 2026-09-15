<script lang="ts">
	let { children, data } = $props();
</script>

{#if !data.email}
	{@render children()}
{:else}
	<div class="flex min-h-screen bg-paper text-ink">
		<aside class="hidden w-52 shrink-0 border-r border-rule md:flex md:flex-col">
			<div class="border-b border-rule px-5 py-5">
				<p class="font-serif text-lg tracking-tight">Dashboard</p>
				<p class="mt-1 text-xs text-muted">{data.email}</p>
			</div>
			<nav class="flex flex-1 flex-col gap-1 p-3 text-sm">
				<a href="/admin" class="rounded-sm px-2 py-1.5 transition-colors hover:bg-surface">Overview</a>
				<a href="/admin/projects" class="rounded-sm px-2 py-1.5 transition-colors hover:bg-surface">Projects</a>
				<a href="/admin/apps" class="rounded-sm px-2 py-1.5 transition-colors hover:bg-surface">Apps</a>
				<a href="/admin/messages" class="rounded-sm px-2 py-1.5 transition-colors hover:bg-surface">Messages</a>
				<a href="/" class="mt-auto px-2 py-1.5 text-muted hover:text-ink">View site</a>
				<form method="POST" action="/admin/logout">
					<button type="submit" class="w-full px-2 py-1.5 text-left text-muted hover:text-ink">
						Log out
					</button>
				</form>
			</nav>
		</aside>

		<div class="flex min-w-0 flex-1 flex-col">
			<header class="flex items-center justify-between border-b border-rule px-4 py-3 md:hidden">
				<p class="font-serif">Dashboard</p>
				<nav class="flex gap-3 text-sm">
					<a href="/admin">Home</a>
					<a href="/admin/projects">Projects</a>
					<a href="/admin/apps">Apps</a>
					<a href="/admin/messages">Inbox</a>
				</nav>
			</header>
			<main class="flex-1 px-4 py-8 sm:px-8">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
