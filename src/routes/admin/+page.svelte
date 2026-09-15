<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard — David Dyck</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-3xl">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<h1 class="font-serif text-3xl tracking-tight">Dashboard</h1>
		<div class="flex gap-4 text-sm">
			<a href="/admin/projects/new" class="text-link">New project</a>
			<a href="/admin/apps/new" class="text-link">New app</a>
		</div>
	</div>

	<p class="mt-6 max-w-xl text-sm leading-relaxed text-muted">
		New project and new app pages can draft the full form from a prompt — listing, copy, and
		privacy — then you review before saving.
	</p>

	<dl class="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
		<div>
			<dt class="text-sm text-muted">Projects</dt>
			<dd class="mt-1 font-serif text-3xl tracking-tight">{data.counts.projects}</dd>
		</div>
		<div>
			<dt class="text-sm text-muted">Apps</dt>
			<dd class="mt-1 font-serif text-3xl tracking-tight">{data.counts.apps}</dd>
		</div>
		<div>
			<dt class="text-sm text-muted">Unread</dt>
			<dd class="mt-1 font-serif text-3xl tracking-tight">{data.counts.unread}</dd>
		</div>
		<div>
			<dt class="text-sm text-muted">Messages</dt>
			<dd class="mt-1 font-serif text-3xl tracking-tight">{data.counts.messages}</dd>
		</div>
	</dl>

	<section class="mt-14">
		<div class="flex items-baseline justify-between gap-4">
			<h2 class="font-serif text-xl tracking-tight">Recent messages</h2>
			<a href="/admin/messages" class="text-sm text-link">Inbox</a>
		</div>
		{#if data.recentMessages.length === 0}
			<p class="mt-4 text-sm text-muted">None yet.</p>
		{:else}
			<ul class="mt-4 divide-y divide-rule border-y border-rule">
				{#each data.recentMessages as message (message.id)}
					<li class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm">
						<div>
							<span class="text-ink">{message.name}</span>
							<a href="mailto:{message.email}" class="ml-2 text-muted hover:text-ink">{message.email}</a>
						</div>
						<time class="text-muted">{message.createdAt}</time>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="mt-14">
		<h2 class="font-serif text-xl tracking-tight">Recent projects</h2>
		{#if data.recentProjects.length === 0}
			<p class="mt-4 text-sm text-muted">None yet.</p>
		{:else}
			<ul class="mt-4 divide-y divide-rule border-y border-rule">
				{#each data.recentProjects as project (project.id)}
					<li class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm">
						<span class="text-ink">{project.title}</span>
						<span class="text-muted">
							{project.status} · {project.published ? 'published' : 'unpublished'}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="mt-14">
		<h2 class="font-serif text-xl tracking-tight">Recent apps</h2>
		{#if data.recentApps.length === 0}
			<p class="mt-4 text-sm text-muted">None yet.</p>
		{:else}
			<ul class="mt-4 divide-y divide-rule border-y border-rule">
				{#each data.recentApps as app (app.id)}
					<li class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm">
						<span class="text-ink">{app.name}</span>
						<span class="text-muted">
							{app.status} · {app.published ? 'published' : 'unpublished'}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
