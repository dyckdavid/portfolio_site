<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { checkMessage } from '$lib/contact-message';

	let { data, form } = $props();
	let sendAnother = $state(false);
	let emailHint = $state('');
	let emailOk = $state(false);
	let checkingEmail = $state(false);
	let messageHint = $state('');
	let messageOk = $state(false);

	const challenge = $derived(form?.challenge ?? data.challenge);

	async function inspectEmail(event: Event) {
		const value = (event.currentTarget as HTMLInputElement).value.trim();
		emailHint = '';
		emailOk = false;
		if (!value) return;

		checkingEmail = true;
		try {
			const res = await fetch('/contact/email', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email: value })
			});
			const payload = (await res.json()) as { ok?: boolean; error?: string };
			if (payload.ok) {
				emailOk = true;
				emailHint = 'That address can receive mail.';
			} else {
				emailHint = payload.error ?? 'That email did not check out.';
			}
		} catch {
			emailHint = '';
		} finally {
			checkingEmail = false;
		}
	}

	function inspectMessage(event: Event) {
		const value = (event.currentTarget as HTMLTextAreaElement).value;
		messageHint = '';
		messageOk = false;
		if (!value.trim()) return;

		const result = checkMessage(value);
		if (result.ok) {
			messageOk = true;
			messageHint = 'That reads like a real note.';
		} else {
			messageHint = result.error;
		}
	}
</script>

<svelte:head>
	<title>Contact — David Dyck</title>
	<meta
		name="description"
		content="Write to David Dyck — what you're building, a timeline, and whether it's a product, a site, or a mess that needs sorting."
	/>
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<Breadcrumb current="Contact" />
		<header class="reveal">
			<h1 class="font-serif text-4xl tracking-tight text-ink sm:text-5xl">Contact</h1>
			<p class="mt-5 max-w-xl leading-relaxed text-muted">
				I read these. Include what you’re building, a timeline if you have one, and whether it’s a
				product, a site, or a mess that needs sorting.
			</p>
		</header>

		<div class="mt-14 grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16">
			<div>
				{#if form?.success && !sendAnother}
					<div>
						<p class="font-serif text-xl text-ink">Received.</p>
						<p class="mt-3 leading-relaxed text-muted">
							I’ll reply when I can. If it is urgent, say so in the next note.
						</p>
						<button
							type="button"
							onclick={() => (sendAnother = true)}
							class="mt-6 text-link text-sm"
						>
							Send another
						</button>
					</div>
				{:else}
					<form method="POST" class="max-w-xl space-y-6" onsubmit={() => (sendAnother = false)}>
						<div class="hidden" aria-hidden="true">
							<label for="website">Website</label>
							<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
						</div>

						<div>
							<label for="name" class="mb-1.5 block text-sm text-ink">Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={form?.name ?? ''}
								required
								minlength="2"
								autocomplete="name"
								placeholder="Your name"
								class="w-full rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
							/>
						</div>

						<div>
							<label for="email" class="mb-1.5 block text-sm text-ink">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={form?.email ?? ''}
								required
								autocomplete="email"
								placeholder="you@example.com"
								onblur={inspectEmail}
								class="w-full rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
							/>
							{#if checkingEmail}
								<p class="mt-1.5 text-xs text-muted">Checking that address…</p>
							{:else if emailHint}
								<p class="mt-1.5 text-xs {emailOk ? 'text-muted' : 'text-danger'}" role="status">
									{emailHint}
								</p>
							{/if}
						</div>

						<div>
							<label for="message" class="mb-1.5 block text-sm text-ink">Message</label>
							<textarea
								id="message"
								name="message"
								value={form?.message ?? ''}
								required
								minlength="10"
								rows="8"
								placeholder="What you’re building, timeline, and what you need."
								onblur={inspectMessage}
								class="w-full resize-y rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
							></textarea>
							{#if messageHint}
								<p class="mt-1.5 text-xs {messageOk ? 'text-muted' : 'text-danger'}" role="status">
									{messageHint}
								</p>
							{:else}
								<p class="mt-1.5 text-xs text-muted">
									A few sentences is enough — ten characters, in ordinary words.
								</p>
							{/if}
						</div>

						<div>
							<label for="human" class="mb-1.5 block text-sm text-ink">{challenge.prompt}</label>
							<input type="hidden" name="challenge" value={challenge.token} />
							<input
								type="text"
								id="human"
								name="human"
								required
								inputmode="numeric"
								autocomplete="off"
								placeholder="Type the number"
								class="w-full rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
							/>
							<p class="mt-1.5 text-xs text-muted">A short check so automated junk stays out.</p>
						</div>

						{#if form?.error}
							<p class="text-sm text-danger" role="alert">{form.error}</p>
						{/if}

						<button type="submit" class="btn-primary">Send</button>
					</form>
				{/if}
			</div>

			<aside class="reveal reveal-2 text-sm leading-relaxed text-muted md:pt-1">
				<p>I work remote. Replies may take a couple of days.</p>
				<p class="mt-4">
					By sending a message you agree your details are handled as described on the
					<a href="/privacy" class="text-link">privacy page</a>.
				</p>
			</aside>
		</div>
	</div>
</section>
