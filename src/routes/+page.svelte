<svelte:head>
	<title>David Dyck — Software engineer</title>
	<meta
		name="description"
		content="David Dyck, software engineer. Programming, remotely."
	/>
</svelte:head>

<section class="bg-paper text-ink">
	<div class="page-shell">
		<header class="reveal mb-16 sm:mb-24">
			<p class="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
				Software · programming · remote
			</p>
			<h1
				class="mt-4 font-serif text-5xl leading-[0.95] tracking-tight text-ink sm:text-7xl md:text-[5.25rem]"
			>
				David Dyck
			</h1>
			<p class="mt-5 max-w-md text-lg text-muted sm:text-xl">
				Software engineer. I write programs. Remote.
			</p>
		</header>

		<div class="mb-24 grid grid-cols-1 gap-10 md:mb-32 md:grid-cols-12 md:gap-16">
			<div class="reveal reveal-2 space-y-5 text-[1.05rem] leading-[1.7] md:col-span-7">
				<p>
					I write software that has to survive after the demo. Not the version that looks
					finished in a screenshot — the one that still works when a field is empty, a
					request times out, or someone who didn’t write it has to change a line six months
					later.
				</p>
				<p>
					The job is the product, the data, and whether the next person can read the code. I
					don’t pick a library as a personality. If a codebase already has a shape, I work
					in that shape. If I’m starting fresh, I pick whatever will still be boring to
					maintain in two years.
				</p>
				<p>
					I work on macOS, Windows, and Linux because that is the actual landscape:
					different machines, different clients, different constraints. I don’t romanticize
					tools. A browser, a server, a database, and version control will get you most of
					the way.
				</p>
			</div>

			<aside class="reveal reveal-3 md:col-span-5 md:pt-1">
				<div class="border border-rule bg-surface p-6 sm:p-7">
					<p class="mb-5 font-mono text-xs uppercase tracking-wide text-muted">Now</p>
					<ul class="space-y-3 text-sm leading-relaxed">
						<li>Available for contract and product work.</li>
						<li>Building web software, remotely.</li>
						<li>
							If you have something specific, start on the
							<a href="/contact" class="text-link">contact form</a>.
						</li>
						<li>Clear problem, real users — that’s the work I take.</li>
					</ul>
				</div>
			</aside>
		</div>

		<section class="mb-28 sm:mb-36">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
				<h2 class="font-serif text-3xl text-ink sm:text-4xl md:col-span-4">Work</h2>
				<div class="md:col-span-8">
					<p class="mb-8 leading-relaxed text-muted">
						Selected work lives on the Work page — titles and links load from the project
						archive.
					</p>
					<ul class="stagger">
						<li class="border-t border-rule">
							<a href="/projects" class="group flex items-start justify-between gap-6 py-5">
								<span>
									<span class="font-serif text-xl group-hover:text-accent"
										>Things that have to last</span
									>
									<span class="mt-2 block text-sm leading-relaxed text-muted">
										Web applications that need to be maintained after launch, not just
										stood up for a walkthrough.
									</span>
								</span>
								<span class="mt-1 shrink-0 text-sm text-muted group-hover:text-accent">View</span>
							</a>
						</li>
						<li class="border-t border-rule">
							<a href="/projects" class="group flex items-start justify-between gap-6 py-5">
								<span>
									<span class="font-serif text-xl group-hover:text-accent"
										>The part people click</span
									>
									<span class="mt-2 block text-sm leading-relaxed text-muted">
										Screens that stay readable after the visual pass — including empty,
										error, and “this field is missing.”
									</span>
								</span>
								<span class="mt-1 shrink-0 text-sm text-muted group-hover:text-accent">View</span>
							</a>
						</li>
						<li class="border-t border-b border-rule">
							<a href="/projects" class="group flex items-start justify-between gap-6 py-5">
								<span>
									<span class="font-serif text-xl group-hover:text-accent">The layer underneath</span>
									<span class="mt-2 block text-sm leading-relaxed text-muted">
										APIs and the data model everything else sits on.
									</span>
								</span>
								<span class="mt-1 shrink-0 text-sm text-muted group-hover:text-accent">View</span>
							</a>
						</li>
					</ul>
					<p class="mt-8">
						<a href="/projects" class="btn-primary">See the archive</a>
					</p>
					<p class="mt-6 max-w-prose text-sm leading-relaxed text-muted">
						I look for a clear problem, real users, and code someone else could inherit
						without a decoder ring.
					</p>
				</div>
			</div>
		</section>

		<section class="mb-20 border-t border-rule pt-14 sm:mb-24 sm:pt-16">
			<h2 class="mb-10 font-serif text-3xl text-ink sm:mb-12 sm:text-4xl">How I tend to work</h2>
			<div class="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
				<div class="md:col-span-7">
					<p class="mb-3 font-serif text-xl">Ship a slice, then another</p>
					<p class="text-[1.05rem] leading-relaxed">
						I ship in increments. A thin slice you can click is more useful than a
						complete plan that never leaves a document. You see the thing, you argue with
						it, we change direction before a month disappears into the wrong version.
					</p>
				</div>
				<div class="md:col-span-5 md:pt-1">
					<p class="mb-3 font-serif text-xl">Read it before you replace it</p>
					<p class="leading-relaxed">
						I read existing code before I rewrite it. Most systems aren’t failing because
						the original idea was stupid. They’re failing because nobody stayed with them.
						Replacing a mess you haven’t understood is how you get a second mess.
					</p>
				</div>
			</div>
		</section>

		<p class="border-t border-rule pt-8 text-sm text-muted">
			If you have a problem that needs an engineer,
			<a href="/contact" class="text-link">use the contact page</a>.
		</p>
	</div>
</section>
