<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
</script>

<svelte:head>
	<title>About — David Dyck</title>
	<meta
		name="description"
		content="About David Dyck, software engineer. Programming, done remotely."
	/>
</svelte:head>

<section class="bg-paper text-ink">
	<div class="mx-auto max-w-[1080px] px-6 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
		<Breadcrumb current="About" />
		<header class="reveal mb-14 sm:mb-20">
			<h1 class="font-serif text-5xl tracking-tight text-ink sm:text-6xl">About</h1>
			<p class="mt-4 max-w-xl text-lg text-muted">
				I write programs. Remote. The parts of software that show up after the first working
				version.
			</p>
		</header>

		<div class="mb-20 grid grid-cols-1 gap-10 md:mb-28 md:grid-cols-12 md:gap-16">
			<div class="reveal reveal-2 space-y-5 text-[1.05rem] leading-[1.75] md:col-span-8">
				<p>
					I got into building software because I wanted things to exist that didn’t. That
					part hasn’t changed. What has is how much of the job sits after the first working
					version: the data that has to stay consistent, the error that only appears on a
					machine I don’t own, the second year of a codebase when the clever bits start to
					cost.
				</p>
				<p>
					I work across the usual layers: the screens people use, the services behind them,
					the data that has to stay true. The interesting problems are usually in the joints
					— a screen that looks done until you ask what happens when the save fails, a
					schema that seemed obvious until the product had to tell the truth about an
					awkward case. I care about those unglamorous parts. They are the product, once
					anyone besides me is using it.
				</p>
				<p>
					I work on macOS, Windows, and Linux. That isn’t a flex. Clients have machines.
					Deployments land somewhere I didn’t pick. The people who inherit the code will
					not have my laptop, my editor layout, or my patience for a README that assumes
					too much. If it only runs where I developed it, it isn’t finished.
				</p>
			</div>
			<aside class="md:col-span-4 md:pt-2">
				<p
					class="font-serif text-xl leading-snug text-ink border-t border-rule pt-5"
				>
					The second year of a codebase is the real test. I plan for that, not the demo.
				</p>
			</aside>
		</div>

		<section class="mb-20 sm:mb-28">
			<h2 class="font-serif text-3xl text-ink mb-8">What I actually do</h2>
			<ul class="max-w-3xl">
				<li class="border-t border-rule py-5">
					<span class="font-serif text-lg">Front-end UI.</span>
					<span class="text-muted">
						Pages, components, and states that have to stay readable after the visual pass
						is over — including empty, error, and “this field is missing” cases.
					</span>
				</li>
				<li class="border-t border-rule py-5">
					<span class="font-serif text-lg">APIs.</span>
					<span class="text-muted">
						REST endpoints with contracts you can rely on, not a pile of special cases
						that only make sense if you wrote them.
					</span>
				</li>
				<li class="border-t border-rule py-5">
					<span class="font-serif text-lg">Data modeling.</span>
					<span class="text-muted">
						Schemas that match how the product actually works, including the awkward parts
						people hope they can paper over.
					</span>
				</li>
				<li class="border-t border-b border-rule py-5">
					<span class="font-serif text-lg">The glue between them.</span>
					<span class="text-muted">
						Validation, errors, auth, migrations — the wiring that keeps the rest from
						falling over once real users show up.
					</span>
				</li>
			</ul>
		</section>

		<section class="mb-16 sm:mb-20">
			<div class="grid grid-cols-1 md:grid-cols-12 gap-8">
				<h2 class="md:col-span-4 font-serif text-3xl text-ink">Working together</h2>
				<div class="md:col-span-8 space-y-4 leading-relaxed text-[1.05rem]">
					<p>
						I work better in writing. A short note that names the problem, the constraint,
						and the deadline is more useful than a call that doesn’t. I want scope before
						I write code — what’s in, what’s out, who it’s for.
					</p>
					<p>
						I will say when something is a bad idea. That isn’t obstruction. It’s cheaper
						to disagree about a plan than to unwind a month of the wrong implementation.
					</p>
				</div>
			</div>
		</section>

		<p class="border-t border-rule pt-8 text-sm text-muted">
			If you want to work together, start on the
			<a href="/contact" class="text-link">contact page</a>. How
			this site handles data is on the
			<a href="/privacy" class="text-link">privacy page</a>.
		</p>
	</div>
</section>
