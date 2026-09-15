import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import {
	appPlatform,
	appStatus,
	apps,
	type App,
	type DataTypeEntry
} from '$lib/server/db/schema';
import { slugify } from '$lib/server/slug';

export type AppFormValues = {
	name: string;
	slug: string;
	tagline: string;
	description: string;
	platform: string;
	category: string;
	bundleId: string;
	appStoreUrl: string;
	playStoreUrl: string;
	website: string;
	iconUrl: string;
	supportUrl: string;
	status: string;
	featured: boolean;
	published: boolean;
	sortOrder: string;
	privacyContactEmail: string;
	privacyIntro: string;
	privacyLastUpdated: string;
	collectsData: boolean;
	dataUsedForTracking: boolean;
	dataLinkedToIdentity: boolean;
	dataTypesText: string;
	thirdParties: string;
	childrenPolicy: string;
};

export type AppRecord = {
	name: string;
	slug: string;
	tagline: string | null;
	description: string | null;
	platform: (typeof appPlatform)[number];
	category: string | null;
	bundleId: string | null;
	appStoreUrl: string | null;
	playStoreUrl: string | null;
	website: string | null;
	iconUrl: string | null;
	supportUrl: string | null;
	status: (typeof appStatus)[number];
	featured: boolean;
	published: boolean;
	sortOrder: number;
	privacyContactEmail: string | null;
	privacyIntro: string | null;
	privacyLastUpdated: Date | null;
	collectsData: boolean;
	dataUsedForTracking: boolean;
	dataLinkedToIdentity: boolean;
	dataTypes: DataTypeEntry[];
	thirdParties: string | null;
	childrenPolicy: string | null;
};

const emptyValues: AppFormValues = {
	name: '',
	slug: '',
	tagline: '',
	description: '',
	platform: 'ios',
	category: '',
	bundleId: '',
	appStoreUrl: '',
	playStoreUrl: '',
	website: '',
	iconUrl: '',
	supportUrl: '',
	status: 'development',
	featured: false,
	published: true,
	sortOrder: '0',
	privacyContactEmail: '',
	privacyIntro: '',
	privacyLastUpdated: '',
	collectsData: false,
	dataUsedForTracking: false,
	dataLinkedToIdentity: false,
	dataTypesText: '',
	thirdParties: '',
	childrenPolicy: ''
};

export function defaultAppFormValues(): AppFormValues {
	return { ...emptyValues };
}

function str(form: FormData, key: string) {
	return String(form.get(key) ?? '').trim();
}

function checked(form: FormData, key: string) {
	return form.getAll(key).map(String).at(-1) === 'true';
}

function isUniqueViolation(error: unknown) {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code: unknown }).code === '23505'
	);
}

export function uniqueViolation(error: unknown) {
	return isUniqueViolation(error);
}

function nullIfEmpty(value: string) {
	return value ? value : null;
}

function parseYes(value: string) {
	const v = value
		.toLowerCase()
		.replace(/^linked:/, '')
		.replace(/^tracking:/, '')
		.trim();
	return v === 'yes' || v === 'true' || v === '1';
}

export function parseDataTypes(raw: string): DataTypeEntry[] {
	return raw
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const parts = line.split('|').map((part) => part.trim());
			return {
				category: parts[0] ?? '',
				types: parts[1] ?? '',
				purpose: parts[2] ?? '',
				linkedToUser: parseYes(parts[3] ?? ''),
				usedForTracking: parseYes(parts[4] ?? '')
			};
		});
}

export function formatDataTypes(entries: DataTypeEntry[] | null | undefined) {
	if (!entries?.length) return '';
	return entries
		.map(
			(entry) =>
				`${entry.category} | ${entry.types} | ${entry.purpose} | linked:${entry.linkedToUser ? 'yes' : 'no'} | tracking:${entry.usedForTracking ? 'yes' : 'no'}`
		)
		.join('\n');
}

function toDateInput(value: Date | string | null | undefined) {
	if (!value) return '';
	const iso = typeof value === 'string' ? value : value.toISOString();
	return iso.slice(0, 10);
}

export function toFormValues(app: App): AppFormValues {
	return {
		name: app.name,
		slug: app.slug,
		tagline: app.tagline ?? '',
		description: app.description ?? '',
		platform: app.platform,
		category: app.category ?? '',
		bundleId: app.bundleId ?? '',
		appStoreUrl: app.appStoreUrl ?? '',
		playStoreUrl: app.playStoreUrl ?? '',
		website: app.website ?? '',
		iconUrl: app.iconUrl ?? '',
		supportUrl: app.supportUrl ?? '',
		status: app.status,
		featured: app.featured,
		published: app.published,
		sortOrder: String(app.sortOrder),
		privacyContactEmail: app.privacyContactEmail ?? '',
		privacyIntro: app.privacyIntro ?? '',
		privacyLastUpdated: toDateInput(app.privacyLastUpdated),
		collectsData: app.collectsData,
		dataUsedForTracking: app.dataUsedForTracking,
		dataLinkedToIdentity: app.dataLinkedToIdentity,
		dataTypesText: formatDataTypes(app.dataTypes),
		thirdParties: app.thirdParties ?? '',
		childrenPolicy: app.childrenPolicy ?? ''
	};
}

function isPlatform(value: string): value is (typeof appPlatform)[number] {
	return (appPlatform as readonly string[]).includes(value);
}

function isStatus(value: string): value is (typeof appStatus)[number] {
	return (appStatus as readonly string[]).includes(value);
}

export async function parseAppForm(
	form: FormData,
	opts: { excludeId?: string } = {}
): Promise<{ values: AppFormValues; error?: string; record?: AppRecord }> {
	const values: AppFormValues = {
		name: str(form, 'name'),
		slug: str(form, 'slug'),
		tagline: str(form, 'tagline'),
		description: str(form, 'description'),
		platform: str(form, 'platform') || 'ios',
		category: str(form, 'category'),
		bundleId: str(form, 'bundleId'),
		appStoreUrl: str(form, 'appStoreUrl'),
		playStoreUrl: str(form, 'playStoreUrl'),
		website: str(form, 'website'),
		iconUrl: str(form, 'iconUrl'),
		supportUrl: str(form, 'supportUrl'),
		status: str(form, 'status') || 'development',
		featured: checked(form, 'featured'),
		published: checked(form, 'published'),
		sortOrder: str(form, 'sortOrder') || '0',
		privacyContactEmail: str(form, 'privacyContactEmail'),
		privacyIntro: str(form, 'privacyIntro'),
		privacyLastUpdated: str(form, 'privacyLastUpdated'),
		collectsData: checked(form, 'collectsData'),
		dataUsedForTracking: checked(form, 'dataUsedForTracking'),
		dataLinkedToIdentity: checked(form, 'dataLinkedToIdentity'),
		dataTypesText: String(form.get('dataTypes') ?? ''),
		thirdParties: str(form, 'thirdParties'),
		childrenPolicy: str(form, 'childrenPolicy')
	};

	if (!values.name) {
		return { values, error: 'Name is required.' };
	}

	if (!isPlatform(values.platform)) {
		return { values, error: 'Pick a valid platform.' };
	}
	if (!isStatus(values.status)) {
		return { values, error: 'Pick a valid status.' };
	}

	const sortOrder = Number.parseInt(values.sortOrder, 10);
	if (!Number.isFinite(sortOrder)) {
		return { values, error: 'Sort order must be a number.' };
	}

	const slug = slugify(values.slug || values.name);
	if (!slug) {
		return { values, error: 'Give it a name we can turn into a slug.' };
	}

	const db = getDb();
	const existing = await db
		.select({ id: apps.id })
		.from(apps)
		.where(eq(apps.slug, slug))
		.limit(1);
	if (existing.length && existing[0].id !== opts.excludeId) {
		return { values, error: 'That slug is already taken.' };
	}

	values.slug = slug;

	let privacyLastUpdated: Date | null = null;
	if (values.privacyLastUpdated) {
		const parsed = new Date(`${values.privacyLastUpdated}T12:00:00.000Z`);
		if (Number.isNaN(parsed.getTime())) {
			return { values, error: 'Last updated date is not valid.' };
		}
		privacyLastUpdated = parsed;
	}

	const record: AppRecord = {
		name: values.name,
		slug,
		tagline: nullIfEmpty(values.tagline),
		description: nullIfEmpty(values.description),
		platform: values.platform,
		category: nullIfEmpty(values.category),
		bundleId: nullIfEmpty(values.bundleId),
		appStoreUrl: nullIfEmpty(values.appStoreUrl),
		playStoreUrl: nullIfEmpty(values.playStoreUrl),
		website: nullIfEmpty(values.website),
		iconUrl: nullIfEmpty(values.iconUrl),
		supportUrl: nullIfEmpty(values.supportUrl),
		status: values.status,
		featured: values.featured,
		published: values.published,
		sortOrder,
		privacyContactEmail: nullIfEmpty(values.privacyContactEmail),
		privacyIntro: nullIfEmpty(values.privacyIntro),
		privacyLastUpdated,
		collectsData: values.collectsData,
		dataUsedForTracking: values.dataUsedForTracking,
		dataLinkedToIdentity: values.dataLinkedToIdentity,
		dataTypes: parseDataTypes(values.dataTypesText),
		thirdParties: nullIfEmpty(values.thirdParties),
		childrenPolicy: nullIfEmpty(values.childrenPolicy)
	};

	return { values, record };
}

export async function getAppBySlug(slug: string) {
	const db = getDb();
	const [app] = await db.select().from(apps).where(eq(apps.slug, slug)).limit(1);
	return app ?? null;
}

export async function getPublishedApp(slug: string) {
	const app = await getAppBySlug(slug);
	if (!app?.published) return null;
	return app;
}
