<script lang="ts">
	let { form } = $props();
</script>

<svelte:head>
	<title>Admin sign in — David Dyck</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
	<div class="w-full max-w-sm">
		<p class="font-serif text-3xl tracking-tight">Sign in</p>
		<p class="mt-2 text-sm text-muted">Admin only. There is no account signup.</p>

		<form method="POST" class="mt-8 space-y-5">
			<div>
				<label for="email" class="mb-1.5 block text-sm">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="username"
					required
					class="w-full rounded-none border border-rule bg-surface px-3 py-2.5"
				/>
			</div>
			<div>
				<label for="password" class="mb-1.5 block text-sm">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					class="w-full rounded-none border border-rule bg-surface px-3 py-2.5"
				/>
			</div>
			{#if form?.error}
				<p class="text-sm text-danger" role="alert">{form.error}</p>
			{/if}
			<button type="submit" class="btn-primary w-full">Sign in</button>
		</form>
	</div>
</div>
