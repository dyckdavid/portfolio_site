<script lang="ts">
	type Values = {
		name?: string;
		slug?: string;
		tagline?: string;
		description?: string;
		platform?: string;
		category?: string;
		bundleId?: string;
		appStoreUrl?: string;
		playStoreUrl?: string;
		website?: string;
		iconUrl?: string;
		supportUrl?: string;
		status?: string;
		featured: boolean;
		published: boolean;
		sortOrder?: string;
		privacyContactEmail?: string;
		privacyIntro?: string;
		privacyLastUpdated?: string;
		collectsData: boolean;
		dataUsedForTracking: boolean;
		dataLinkedToIdentity: boolean;
		dataTypesText?: string;
		thirdParties?: string;
		childrenPolicy?: string;
	};

	type DataRow = {
		category: string;
		types: string;
		purpose: string;
		linkedToUser: boolean;
		usedForTracking: boolean;
	};

	let {
		values = $bindable(),
		error,
		submitLabel = 'Save',
		privacyUrl = '',
		cancelHref = '/admin/apps',
		action = ''
	}: {
		values: Values;
		error?: string;
		submitLabel?: string;
		privacyUrl?: string;
		cancelHref?: string;
		action?: string;
	} = $props();

	const field =
		'w-full rounded-none border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-muted';

	const platforms = [
		{ value: 'ios', label: 'iOS', hint: 'iPhone and iPad' },
		{ value: 'android', label: 'Android', hint: 'Play Store' },
		{ value: 'macos', label: 'macOS', hint: 'Mac App Store or download' },
		{ value: 'web', label: 'Web', hint: 'Browser app, no store listing' },
		{ value: 'multi', label: 'Multi-platform', hint: 'More than one of the above' }
	];

	const statuses = [
		{ value: 'development', label: 'Development', hint: 'You are still building it' },
		{ value: 'in-review', label: 'In review', hint: 'Waiting on the store' },
		{ value: 'live', label: 'Live', hint: 'People can get it now' },
		{ value: 'sunset', label: 'Sunset', hint: 'No longer offered' }
	];

	const categories = [
		'Contact Info',
		'Health & Fitness',
		'Financial Info',
		'Location',
		'Sensitive Info',
		'Contacts',
		'User Content',
		'Browsing History',
		'Search History',
		'Identifiers',
		'Purchases',
		'Usage Data',
		'Diagnostics',
		'Other'
	];

	const slugPreview = $derived(
		(values.slug || values.name || '')
			.toLowerCase()
			.trim()
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 80)
	);

	const publicPath = $derived(slugPreview ? `/apps/${slugPreview}` : '/apps/…');
	const privacyPath = $derived(`${publicPath}/privacy`);

	let copied = $state(false);

	function parseRows(raw: string): DataRow[] {
		return raw
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => {
				const parts = line.split('|').map((part) => part.trim());
				const flag = (value: string) => /yes|true|1/i.test(value.replace(/^linked:|^tracking:/i, ''));
				return {
					category: parts[0] ?? '',
					types: parts[1] ?? '',
					purpose: parts[2] ?? '',
					linkedToUser: flag(parts[3] ?? ''),
					usedForTracking: flag(parts[4] ?? '')
				};
			});
	}

	function formatRows(rows: DataRow[]) {
		return rows
			.filter((row) => row.category || row.types || row.purpose)
			.map(
				(row) =>
					`${row.category} | ${row.types} | ${row.purpose} | linked:${row.linkedToUser ? 'yes' : 'no'} | tracking:${row.usedForTracking ? 'yes' : 'no'}`
			)
			.join('\n');
	}

	let rows = $state<DataRow[]>(parseRows(values.dataTypesText ?? ''));

	$effect(() => {
		const incoming = values.dataTypesText ?? '';
		if (incoming !== formatRows(rows)) {
			rows = parseRows(incoming);
		}
	});

	$effect(() => {
		if (!values.collectsData) {
			values.dataUsedForTracking = false;
			values.dataLinkedToIdentity = false;
		}
	});

	function emptyRow(): DataRow {
		return {
			category: 'Identifiers',
			types: '',
			purpose: '',
			linkedToUser: false,
			usedForTracking: false
		};
	}

	function syncRows(next: DataRow[]) {
		rows = next;
		values.dataTypesText = formatRows(next);
	}

	function addRow() {
		syncRows([...rows, emptyRow()]);
	}

	function removeRow(index: number) {
		syncRows(rows.filter((_, i) => i !== index));
	}

	function updateRow(index: number, patch: Partial<DataRow>) {
		syncRows(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
	}

	async function copyPrivacy() {
		const path = privacyUrl || privacyPath;
		try {
			await navigator.clipboard.writeText(
				path.startsWith('http') ? path : `${window.location.origin}${path}`
			);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			copied = false;
		}
	}
</script>

<nav class="mt-8 mb-10 max-w-3xl border border-rule bg-surface px-5 py-4 text-sm" aria-label="Form steps">
	<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Four steps</p>
	<ol class="mt-3 grid gap-2 sm:grid-cols-2">
		<li><a href="#step-listing" class="text-link">1. Listing</a> — name and what it does</li>
		<li><a href="#step-visibility" class="text-link">2. Visibility</a> — site and store status</li>
		<li><a href="#step-links" class="text-link">3. Links</a> — stores, site, icon</li>
		<li><a href="#step-privacy" class="text-link">4. Privacy</a> — the App Store page</li>
	</ol>
</nav>

<form method="POST" {action} class="max-w-3xl space-y-14">
	<section id="step-listing" class="scroll-mt-6 space-y-5">
		<header class="border-b border-rule pb-4">
			<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Step 1 of 4</p>
			<h2 class="mt-1 font-serif text-2xl tracking-tight">Listing</h2>
			<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
				This is the public card on <span class="font-mono">/apps</span> and the app’s own page.
				Name is the only required field.
			</p>
		</header>

		<div>
			<label for="name" class="mb-1.5 block text-sm">App name <span class="text-muted">(required)</span></label>
			<input id="name" name="name" required bind:value={values.name} class={field} />
			<p class="mt-1.5 text-xs leading-relaxed text-muted">The title people see. Same as the store name if you can.</p>
		</div>

		<div>
			<label for="slug" class="mb-1.5 block text-sm">URL slug <span class="text-muted">(optional)</span></label>
			<input
				id="slug"
				name="slug"
				bind:value={values.slug}
				placeholder="Leave blank to generate from the name"
				class={field}
			/>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">
				Public page will be
				{#if slugPreview}
					<a href={publicPath} class="font-mono text-link">{publicPath}</a>.
				{:else}
					<code class="font-mono">{publicPath}</code>.
				{/if}
				Privacy page will be
				{#if slugPreview}
					<a href={privacyPath} class="font-mono text-link">{privacyPath}</a>.
				{:else}
					<code class="font-mono">{privacyPath}</code>.
				{/if}
			</p>
		</div>

		<div>
			<label for="tagline" class="mb-1.5 block text-sm">Tagline <span class="text-muted">(optional)</span></label>
			<input
				id="tagline"
				name="tagline"
				bind:value={values.tagline}
				placeholder="One line. What it is, not a slogan."
				class={field}
			/>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">Shows under the name on the apps list.</p>
		</div>

		<div>
			<label for="description" class="mb-1.5 block text-sm">Description <span class="text-muted">(optional)</span></label>
			<textarea
				id="description"
				name="description"
				rows="5"
				class={field}
				bind:value={values.description}
				placeholder="What the app does, who it is for, and what it does not do."
			></textarea>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">The longer copy on the app page.</p>
		</div>

		<div class="grid gap-5 sm:grid-cols-2">
			<div>
				<label for="platform" class="mb-1.5 block text-sm">Platform</label>
				<select id="platform" name="platform" bind:value={values.platform} class={field}>
					{#each platforms as platform}
						<option value={platform.value}>{platform.label}</option>
					{/each}
				</select>
				<p class="mt-1.5 text-xs leading-relaxed text-muted">
					{platforms.find((item) => item.value === values.platform)?.hint ?? 'Where it runs.'}
				</p>
			</div>
			<div>
				<label for="category" class="mb-1.5 block text-sm">Store category <span class="text-muted">(optional)</span></label>
				<input
					id="category"
					name="category"
					bind:value={values.category}
					placeholder="Productivity"
					class={field}
				/>
				<p class="mt-1.5 text-xs leading-relaxed text-muted">Same label Apple or Google use, if you have one.</p>
			</div>
			<div>
				<label for="bundleId" class="mb-1.5 block text-sm">Bundle ID <span class="text-muted">(optional)</span></label>
				<input
					id="bundleId"
					name="bundleId"
					bind:value={values.bundleId}
					placeholder="com.yourname.app"
					class={field}
				/>
				<p class="mt-1.5 text-xs leading-relaxed text-muted">Xcode / Play Console identifier. Skip if you do not have it yet.</p>
			</div>
		</div>
	</section>

	<section id="step-visibility" class="scroll-mt-6 space-y-5">
		<header class="border-b border-rule pb-4">
			<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Step 2 of 4</p>
			<h2 class="mt-1 font-serif text-2xl tracking-tight">Visibility</h2>
			<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
				Controls whether this listing is on the public site. Separate from whether the store listing
				is live.
			</p>
		</header>

		<div class="grid gap-5 sm:grid-cols-2">
			<div>
				<label for="status" class="mb-1.5 block text-sm">Build status</label>
				<select id="status" name="status" bind:value={values.status} class={field}>
					{#each statuses as status}
						<option value={status.value}>{status.label}</option>
					{/each}
				</select>
				<p class="mt-1.5 text-xs leading-relaxed text-muted">
					{statuses.find((item) => item.value === values.status)?.hint ?? 'Where the product is.'}
				</p>
			</div>
			<div>
				<label for="sortOrder" class="mb-1.5 block text-sm">List order</label>
				<input
					id="sortOrder"
					name="sortOrder"
					type="number"
					bind:value={values.sortOrder}
					class={field}
				/>
				<p class="mt-1.5 text-xs leading-relaxed text-muted">
					Lower numbers show first. Featured apps still jump to the top.
				</p>
			</div>
		</div>

		<div class="space-y-4 border border-rule bg-surface px-4 py-4">
			<label class="flex items-start gap-3 text-sm">
				<input type="hidden" name="published" value="false" />
				<input
					type="checkbox"
					name="published"
					value="true"
					bind:checked={values.published}
					class="mt-0.5 rounded-none border-rule"
				/>
				<span>
					<span class="block">Show on the public site</span>
					<span class="mt-1 block text-xs leading-relaxed text-muted">
						Off = draft. The listing and privacy URL stay hidden until this is on.
					</span>
				</span>
			</label>
			<label class="flex items-start gap-3 text-sm">
				<input type="hidden" name="featured" value="false" />
				<input
					type="checkbox"
					name="featured"
					value="true"
					bind:checked={values.featured}
					class="mt-0.5 rounded-none border-rule"
				/>
				<span>
					<span class="block">Pin to the top of /apps</span>
					<span class="mt-1 block text-xs leading-relaxed text-muted">
						Use for the one or two apps you want seen first.
					</span>
				</span>
			</label>
		</div>
	</section>

	<section id="step-links" class="scroll-mt-6 space-y-5">
		<header class="border-b border-rule pb-4">
			<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Step 3 of 4</p>
			<h2 class="mt-1 font-serif text-2xl tracking-tight">Links</h2>
			<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
				Leave a field blank if you do not have it. Empty is better than a guess.
			</p>
		</header>

		<div>
			<label for="appStoreUrl" class="mb-1.5 block text-sm">App Store URL <span class="text-muted">(optional)</span></label>
			<input
				id="appStoreUrl"
				name="appStoreUrl"
				type="url"
				bind:value={values.appStoreUrl}
				placeholder="https://apps.apple.com/…"
				class={field}
			/>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">The public iOS / Mac listing. Not App Store Connect.</p>
		</div>
		<div>
			<label for="playStoreUrl" class="mb-1.5 block text-sm">Play Store URL <span class="text-muted">(optional)</span></label>
			<input
				id="playStoreUrl"
				name="playStoreUrl"
				type="url"
				bind:value={values.playStoreUrl}
				placeholder="https://play.google.com/store/apps/…"
				class={field}
			/>
		</div>
		<div>
			<label for="website" class="mb-1.5 block text-sm">Marketing site <span class="text-muted">(optional)</span></label>
			<input id="website" name="website" type="url" bind:value={values.website} class={field} />
			<p class="mt-1.5 text-xs leading-relaxed text-muted">A homepage if the app has one besides this portfolio.</p>
		</div>
		<div>
			<label for="iconUrl" class="mb-1.5 block text-sm">Icon image URL <span class="text-muted">(optional)</span></label>
			<input id="iconUrl" name="iconUrl" type="url" bind:value={values.iconUrl} class={field} />
			<p class="mt-1.5 text-xs leading-relaxed text-muted">Direct link to a square PNG or JPEG. Not a local file upload.</p>
		</div>
		<div>
			<label for="supportUrl" class="mb-1.5 block text-sm">Support URL <span class="text-muted">(optional)</span></label>
			<input
				id="supportUrl"
				name="supportUrl"
				type="url"
				bind:value={values.supportUrl}
				placeholder="https://yoursite.com/contact"
				class={field}
			/>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">Where users go for help. Can be your contact page.</p>
		</div>
	</section>

	<section id="step-privacy" class="scroll-mt-6 space-y-5">
		<header class="border-b border-rule pb-4">
			<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Step 4 of 4</p>
			<h2 class="mt-1 font-serif text-2xl tracking-tight">Privacy</h2>
			<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
				This writes the public page App Store Connect asks for. Publish the app (step 2), then paste
				the privacy URL into App Store Connect → App Privacy.
			</p>
		</header>

		<div class="border border-rule bg-surface px-4 py-4">
			<p class="text-sm">Privacy URL to paste into App Store Connect</p>
			<p class="mt-2 break-all font-mono text-sm">{privacyUrl || privacyPath}</p>
			<div class="mt-3 flex flex-wrap gap-3">
				<button type="button" class="text-sm text-link" onclick={copyPrivacy}>
					{copied ? 'Copied' : 'Copy URL'}
				</button>
				{#if slugPreview}
					<a href={publicPath} class="text-sm text-link">Open app page</a>
					<a href={privacyPath} class="text-sm text-link">Open privacy page</a>
				{/if}
			</div>
			{#if !values.published}
				<p class="mt-3 text-xs leading-relaxed text-muted">
					“Show on the public site” is off, so /apps will not list this yet. The links still work
					for you while you are signed in.
				</p>
			{/if}
		</div>

		<div>
			<label for="privacyContactEmail" class="mb-1.5 block text-sm">Privacy contact email <span class="text-muted">(optional)</span></label>
			<input
				id="privacyContactEmail"
				name="privacyContactEmail"
				type="email"
				bind:value={values.privacyContactEmail}
				class={field}
			/>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">Shown on the policy if someone wants data deleted or explained.</p>
		</div>

		<div>
			<label for="privacyIntro" class="mb-1.5 block text-sm">Policy opening <span class="text-muted">(optional)</span></label>
			<textarea
				id="privacyIntro"
				name="privacyIntro"
				rows="4"
				class={field}
				bind:value={values.privacyIntro}
				placeholder="A short paragraph: what the app is, and the rule for data."
			></textarea>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">First section of the public privacy page. Plain language.</p>
		</div>

		<div>
			<label for="privacyLastUpdated" class="mb-1.5 block text-sm">Policy date <span class="text-muted">(optional)</span></label>
			<input
				id="privacyLastUpdated"
				name="privacyLastUpdated"
				type="date"
				bind:value={values.privacyLastUpdated}
				class={field}
			/>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">Change this when the collection story changes, not on every typo.</p>
		</div>

		<div class="space-y-4 border border-rule bg-surface px-4 py-4">
			<p class="text-sm">What Apple will ask you to declare</p>
			<label class="flex items-start gap-3 text-sm">
				<input type="hidden" name="collectsData" value="false" />
				<input
					type="checkbox"
					name="collectsData"
					value="true"
					bind:checked={values.collectsData}
					class="mt-0.5 rounded-none border-rule"
				/>
				<span>
					<span class="block">This app collects data</span>
					<span class="mt-1 block text-xs leading-relaxed text-muted">
						On if anything leaves the device: accounts, analytics, crash reports, ads. Off for a
						fully local app.
					</span>
				</span>
			</label>

			{#if values.collectsData}
				<label class="flex items-start gap-3 text-sm">
					<input type="hidden" name="dataUsedForTracking" value="false" />
					<input
						type="checkbox"
						name="dataUsedForTracking"
						value="true"
						bind:checked={values.dataUsedForTracking}
						class="mt-0.5 rounded-none border-rule"
					/>
					<span>
						<span class="block">Used for tracking</span>
						<span class="mt-1 block text-xs leading-relaxed text-muted">
							Apple’s meaning: linking data to other companies’ apps or sites for ads or sharing.
							Most indie apps leave this off.
						</span>
					</span>
				</label>
				<label class="flex items-start gap-3 text-sm">
					<input type="hidden" name="dataLinkedToIdentity" value="false" />
					<input
						type="checkbox"
						name="dataLinkedToIdentity"
						value="true"
						bind:checked={values.dataLinkedToIdentity}
						class="mt-0.5 rounded-none border-rule"
					/>
					<span>
						<span class="block">Linked to the user’s identity</span>
						<span class="mt-1 block text-xs leading-relaxed text-muted">
							On if you can tell which person it belongs to — email, account, or a stable user ID.
						</span>
					</span>
				</label>
			{:else}
				<input type="hidden" name="dataUsedForTracking" value="false" />
				<input type="hidden" name="dataLinkedToIdentity" value="false" />
			{/if}
		</div>

		{#if values.collectsData}
			<div class="space-y-3">
				<div>
					<p class="text-sm">Data types</p>
					<p class="mt-1.5 text-xs leading-relaxed text-muted">
						One row per category Apple lists. “Types” is the specific item (email, crash logs).
						“Purpose” is why (app functionality, analytics).
					</p>
				</div>

				{#if rows.length === 0}
					<p class="text-sm text-muted">No types yet. Add a row if you collect anything.</p>
				{/if}

				{#each rows as row, index}
					<fieldset class="space-y-3 border border-rule p-4">
						<legend class="px-1 text-sm">Type {index + 1}</legend>
						<div class="grid gap-3 sm:grid-cols-2">
							<div>
								<label for="dtype-cat-{index}" class="mb-1 block text-xs text-muted">Category</label>
								<select
									id="dtype-cat-{index}"
									class={field}
									value={row.category}
									onchange={(event) =>
										updateRow(index, { category: (event.currentTarget as HTMLSelectElement).value })}
								>
									{#each categories as category}
										<option value={category}>{category}</option>
									{/each}
									{#if row.category && !categories.includes(row.category)}
										<option value={row.category}>{row.category}</option>
									{/if}
								</select>
							</div>
							<div>
								<label for="dtype-types-{index}" class="mb-1 block text-xs text-muted">Specific types</label>
								<input
									id="dtype-types-{index}"
									class={field}
									value={row.types}
									placeholder="email address, crash data"
									oninput={(event) =>
										updateRow(index, { types: (event.currentTarget as HTMLInputElement).value })}
								/>
							</div>
						</div>
						<div>
							<label for="dtype-purpose-{index}" class="mb-1 block text-xs text-muted">Purpose</label>
							<input
								id="dtype-purpose-{index}"
								class={field}
								value={row.purpose}
								placeholder="app functionality, analytics"
								oninput={(event) =>
									updateRow(index, { purpose: (event.currentTarget as HTMLInputElement).value })}
							/>
						</div>
						<div class="flex flex-wrap gap-6">
							<label class="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									class="rounded-none border-rule"
									checked={row.linkedToUser}
									onchange={(event) =>
										updateRow(index, {
											linkedToUser: (event.currentTarget as HTMLInputElement).checked
										})}
								/>
								Linked to identity
							</label>
							<label class="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									class="rounded-none border-rule"
									checked={row.usedForTracking}
									onchange={(event) =>
										updateRow(index, {
											usedForTracking: (event.currentTarget as HTMLInputElement).checked
										})}
								/>
								Used for tracking
							</label>
						</div>
						<button type="button" class="text-sm text-muted hover:text-ink" onclick={() => removeRow(index)}>
							Remove this type
						</button>
					</fieldset>
				{/each}

				<button type="button" class="text-sm text-link" onclick={addRow}>Add a data type</button>
			</div>
		{/if}

		<textarea class="hidden" name="dataTypes" bind:value={values.dataTypesText}></textarea>

		<div>
			<label for="thirdParties" class="mb-1.5 block text-sm">Third parties <span class="text-muted">(optional)</span></label>
			<textarea
				id="thirdParties"
				name="thirdParties"
				rows="3"
				class={field}
				bind:value={values.thirdParties}
				placeholder="None. Or name the SDK and what it receives."
			></textarea>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">
				Anyone else who gets data: analytics, crash tools, auth, payments. Write “None” if it stays on device.
			</p>
		</div>

		<div>
			<label for="childrenPolicy" class="mb-1.5 block text-sm">Children <span class="text-muted">(optional)</span></label>
			<textarea
				id="childrenPolicy"
				name="childrenPolicy"
				rows="3"
				class={field}
				bind:value={values.childrenPolicy}
				placeholder="Not directed at children under 13, and it does not knowingly collect their data."
			></textarea>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">App Store review looks for this. Keep it literal.</p>
		</div>
	</section>

	{#if error}
		<p class="text-sm text-danger" role="alert">{error}</p>
	{/if}

	<div class="flex flex-wrap items-center gap-3 border-t border-rule pt-6">
		<button type="submit" class="btn-primary">{submitLabel}</button>
		<a href={cancelHref} class="inline-flex items-center px-4 py-2 text-sm text-muted hover:text-ink">
			Cancel
		</a>
		<p class="w-full text-xs leading-relaxed text-muted sm:w-auto">
			Saving writes the listing. Apple only sees the privacy URL after the app is published.
		</p>
	</div>
</form>
