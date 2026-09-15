<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>Privacy — David Dyck</title>
	<meta
		name="description"
		content="How David Dyck's portfolio handles contact messages, analytics, and hosting logs."
	/>
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<article class="max-w-prose">
			<Breadcrumb current="Privacy" />
			<h1 class="reveal font-serif text-4xl tracking-tight text-ink sm:text-5xl">Privacy</h1>
			<p class="mt-5 leading-relaxed text-muted">
				This is the privacy note for my portfolio — a small personal site, not a product with
				accounts. It covers what is collected, why, and how to ask for it to be deleted.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">What this site collects</h2>

			<h3 class="mt-8 font-serif text-xl text-ink">Contact form</h3>
			<p class="mt-3 leading-relaxed">
				If you send a message, I store your name, email, and message in Google Firebase / Cloud
				Firestore so I can read it and reply. I also store a timestamp and a read flag (whether I
				have opened it yet).
			</p>

			<h3 class="mt-8 font-serif text-xl text-ink">Analytics</h3>
			<p class="mt-3 leading-relaxed">
				Firebase Analytics may run in the browser when the environment supports it. When it does,
				Google may process usage data on my behalf. Analytics is initialized only if Firebase
				reports that it is supported in that browser.
			</p>

			<h3 class="mt-8 font-serif text-xl text-ink">Hosting logs</h3>
			<p class="mt-3 leading-relaxed">
				The hosting provider may keep ordinary request logs — IP address, user agent, and related
				metadata — as part of serving the site. I do not run a separate logging stack on top of
				that.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">What this site does not do</h2>
			<p class="mt-3 leading-relaxed">
				There is no account system. There is no newsletter. I do not sell personal data.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">Retention</h2>
			<p class="mt-3 leading-relaxed">
				Contact messages are kept until I no longer need them to reply or to keep a record of the
				conversation. I can delete a message on request.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">Access and deletion</h2>
			<p class="mt-3 leading-relaxed">
				To ask for a copy of what I have, or to have it deleted, use the
				<a href="/contact" class="text-link">contact form</a>
				(or the same channel you already used) and mention “privacy” in the subject or opening
				line.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">Third parties</h2>
			<p class="mt-3 leading-relaxed">
				I use Google Firebase for Cloud Firestore (contact messages) and, when supported,
				Analytics. The hosting provider processes requests in order to serve the site.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">Appearance</h2>
			<p class="mt-3 leading-relaxed">
				If you switch between light and dark mode, that choice is stored in your browser
				(localStorage) so it persists on this device. It is not sent to me.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">Cookies</h2>
			<p class="mt-3 leading-relaxed">
				Firebase Analytics may set cookies or similar storage when it runs. There are no marketing
				pixels on this site that I know of.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">Children</h2>
			<p class="mt-3 leading-relaxed">This site is not directed at children.</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">Changes</h2>
			<p class="mt-3 leading-relaxed">
				I may update this page when the site or how it handles data changes. The date below is
				when this version was written.
			</p>

			<h2 class="mt-12 font-serif text-2xl text-ink">Contact</h2>
			<p class="mt-3 leading-relaxed">
				Questions about this note go to the
				<a href="/contact" class="text-link">contact page</a>.
			</p>

			<p class="mt-14 text-sm text-muted">Last updated 28 August 2026.</p>
		</article>
	</div>
</section>
