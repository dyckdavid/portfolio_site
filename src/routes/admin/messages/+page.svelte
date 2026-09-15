<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Messages — David Dyck</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-3xl">
	<h1 class="font-serif text-3xl tracking-tight">Messages</h1>

	{#if data.messages.length === 0}
		<p class="mt-10 text-muted">No messages yet.</p>
	{:else}
		<ul class="mt-10 divide-y divide-rule border-y border-rule">
			{#each data.messages as message (message.id)}
				<li class="py-8 {message.read ? 'text-muted' : 'text-ink'}">
					<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
						<div>
							<span class="font-medium">{message.name}</span>
							<a href="mailto:{message.email}" class="ml-2 text-sm text-muted hover:text-ink">
								{message.email}
							</a>
						</div>
						<time class="text-sm text-muted">{message.createdAt}</time>
					</div>

					<p class="mt-4 whitespace-pre-wrap break-words leading-relaxed">{message.body}</p>

					<div class="mt-5 flex flex-wrap gap-4 text-sm">
						{#if message.read}
							<form method="POST" action="?/markUnread">
								<input type="hidden" name="id" value={message.id} />
								<button type="submit" class="text-muted hover:text-ink">Mark unread</button>
							</form>
						{:else}
							<form method="POST" action="?/markRead">
								<input type="hidden" name="id" value={message.id} />
								<button type="submit" class="text-muted hover:text-ink">Mark read</button>
							</form>
						{/if}
						<form method="POST" action="?/delete">
							<input type="hidden" name="id" value={message.id} />
							<button
								type="submit"
								class="text-danger hover:underline"
								onclick={(e) => {
									if (!confirm('Delete this message?')) e.preventDefault();
								}}
							>
								Delete
							</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
