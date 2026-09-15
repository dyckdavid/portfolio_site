import { isAppPlatform, primaryPlatform, resolvePlatforms } from '$lib/platforms';

export type AppImportValues = {
	name: string;
	slug: string;
	tagline: string;
	description: string;
	platform: string;
	platforms: string[];
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

const appStatuses = ['development', 'in-review', 'live', 'sunset'] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function text(value: unknown) {
	if (value == null) return '';
	return String(value).trim();
}

function bool(value: unknown, fallback = false) {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'string') {
		const v = value.toLowerCase();
		if (v === 'true' || v === 'yes' || v === '1') return true;
		if (v === 'false' || v === 'no' || v === '0') return false;
	}
	return fallback;
}

function numString(value: unknown, fallback: string) {
	if (value == null || value === '') return fallback;
	const n = Number(value);
	return Number.isFinite(n) ? String(n) : fallback;
}

function formatDataTypes(entries: unknown): string {
	if (typeof entries === 'string') return entries.trim();
	if (!Array.isArray(entries)) return '';
	return entries
		.map((entry) => {
			const row = asRecord(entry);
			if (!row) return '';
			return `${text(row.category)} | ${text(row.types)} | ${text(row.purpose)} | linked:${bool(row.linkedToUser) ? 'yes' : 'no'} | tracking:${bool(row.usedForTracking) ? 'yes' : 'no'}`;
		})
		.filter((line) => {
			const [category = '', types = '', purpose = ''] = line.split('|');
			return Boolean(category.trim() || types.trim() || purpose.trim());
		})
		.join('\n');
}

export function parseAppImportJson(rawText: string): { values: AppImportValues } | { error: string } {
	let parsed: unknown;
	try {
		parsed = JSON.parse(rawText);
	} catch {
		return { error: 'That file is not valid JSON.' };
	}

	const raw = asRecord(parsed);
	if (!raw) {
		return { error: 'JSON must be one object, not an array.' };
	}

	const kind = text(raw.kind).toLowerCase();
	if (kind && kind !== 'app') {
		return { error: 'This importer is for apps. Set "kind": "app".' };
	}
	if (!text(raw.name)) {
		return { error: 'App JSON needs a name.' };
	}

	const fromList = Array.isArray(raw.platforms)
		? raw.platforms.map((item) => text(item)).filter(Boolean)
		: [];
	const platforms = resolvePlatforms({
		platform: text(raw.platform) || undefined,
		platforms: fromList
	});
	if (!platforms.length && text(raw.platform) && !isAppPlatform(text(raw.platform))) {
		return { error: `Unknown platform: ${text(raw.platform)}.` };
	}
	if (!platforms.length) {
		return { error: 'App JSON needs at least one platform.' };
	}
	const platform = primaryPlatform(platforms);
	const status = text(raw.status) || 'development';
	if (!appStatuses.includes(status as (typeof appStatuses)[number])) {
		return { error: `Status must be one of: ${appStatuses.join(', ')}.` };
	}

	return {
		values: {
			name: text(raw.name),
			slug: text(raw.slug),
			tagline: text(raw.tagline),
			description: text(raw.description),
			platform,
			platforms,
			category: text(raw.category),
			bundleId: text(raw.bundleId),
			appStoreUrl: text(raw.appStoreUrl),
			playStoreUrl: text(raw.playStoreUrl),
			website: text(raw.website),
			iconUrl: text(raw.iconUrl),
			supportUrl: text(raw.supportUrl),
			status,
			featured: bool(raw.featured),
			published: raw.published === undefined ? true : bool(raw.published, true),
			sortOrder: numString(raw.sortOrder, '0'),
			privacyContactEmail: text(raw.privacyContactEmail),
			privacyIntro: text(raw.privacyIntro),
			privacyLastUpdated: text(raw.privacyLastUpdated).slice(0, 10),
			collectsData: bool(raw.collectsData),
			dataUsedForTracking: bool(raw.dataUsedForTracking),
			dataLinkedToIdentity: bool(raw.dataLinkedToIdentity),
			dataTypesText: formatDataTypes(raw.dataTypes ?? raw.dataTypesText),
			thirdParties: text(raw.thirdParties),
			childrenPolicy: text(raw.childrenPolicy)
		}
	};
}
