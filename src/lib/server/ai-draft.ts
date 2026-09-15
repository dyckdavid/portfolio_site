import { defaultProjectFormValues, type ProjectFormValues } from '$lib/project-form';
import { formatDataTypes, type AppFormValues } from '$lib/server/apps';
import { appPlatform, appStatus, projectStatus, type DataTypeEntry } from '$lib/server/db/schema';
import { primaryPlatform, resolvePlatforms } from '$lib/platforms';
import { slugify } from '$lib/server/slug';
import { xaiJson } from '$lib/server/xai';

export type { ProjectFormValues };

const voice = `You draft copy for David Dyck's portfolio. He is a software engineer. First person. Dry. Specific. No marketing voice. Do not write "craft digital experiences", "passionate", "leverage", or "cutting-edge". Do not lead with framework names (Svelte, React, etc.) as identity — mention a library only if the user named it as a fact about the project. Do not invent employers, clients, years, store URLs, GitHub URLs, or bundle IDs. If a fact is missing, leave that field empty. Empty string, not a guess.`;

const projectSchema = {
	type: 'object',
	additionalProperties: false,
	required: [
		'title',
		'slug',
		'summary',
		'description',
		'author',
		'role',
		'client',
		'website',
		'github',
		'status',
		'year',
		'stack',
		'coverUrl',
		'featured',
		'published',
		'sortOrder'
	],
	properties: {
		title: { type: 'string' },
		slug: { type: 'string' },
		summary: { type: 'string' },
		description: { type: 'string' },
		author: { type: 'string' },
		role: { type: 'string' },
		client: { type: 'string' },
		website: { type: 'string' },
		github: { type: 'string' },
		status: { type: 'string', enum: [...projectStatus] },
		year: { type: 'integer' },
		stack: { type: 'string' },
		coverUrl: { type: 'string' },
		featured: { type: 'boolean' },
		published: { type: 'boolean' },
		sortOrder: { type: 'integer' }
	}
};

const appSchema = {
	type: 'object',
	additionalProperties: false,
	required: [
		'name',
		'slug',
		'tagline',
		'description',
		'platform',
		'platforms',
		'category',
		'bundleId',
		'appStoreUrl',
		'playStoreUrl',
		'website',
		'iconUrl',
		'supportUrl',
		'status',
		'featured',
		'published',
		'sortOrder',
		'privacyContactEmail',
		'privacyIntro',
		'privacyLastUpdated',
		'collectsData',
		'dataUsedForTracking',
		'dataLinkedToIdentity',
		'dataTypes',
		'thirdParties',
		'childrenPolicy'
	],
	properties: {
		name: { type: 'string' },
		slug: { type: 'string' },
		tagline: { type: 'string' },
		description: { type: 'string' },
		platform: { type: 'string', enum: [...appPlatform] },
		platforms: {
			type: 'array',
			items: { type: 'string', enum: [...appPlatform] }
		},
		category: { type: 'string' },
		bundleId: { type: 'string' },
		appStoreUrl: { type: 'string' },
		playStoreUrl: { type: 'string' },
		website: { type: 'string' },
		iconUrl: { type: 'string' },
		supportUrl: { type: 'string' },
		status: { type: 'string', enum: [...appStatus] },
		featured: { type: 'boolean' },
		published: { type: 'boolean' },
		sortOrder: { type: 'integer' },
		privacyContactEmail: { type: 'string' },
		privacyIntro: { type: 'string' },
		privacyLastUpdated: { type: 'string' },
		collectsData: { type: 'boolean' },
		dataUsedForTracking: { type: 'boolean' },
		dataLinkedToIdentity: { type: 'boolean' },
		dataTypes: {
			type: 'array',
			items: {
				type: 'object',
				additionalProperties: false,
				required: ['category', 'types', 'purpose', 'linkedToUser', 'usedForTracking'],
				properties: {
					category: { type: 'string' },
					types: { type: 'string' },
					purpose: { type: 'string' },
					linkedToUser: { type: 'boolean' },
					usedForTracking: { type: 'boolean' }
				}
			}
		},
		thirdParties: { type: 'string' },
		childrenPolicy: { type: 'string' }
	}
};

type ProjectRaw = {
	title: string;
	slug: string;
	summary: string;
	description: string;
	author: string;
	role: string;
	client: string;
	website: string;
	github: string;
	status: string;
	year: number;
	stack: string;
	coverUrl: string;
	featured: boolean;
	published: boolean;
	sortOrder: number;
};

type AppRaw = Omit<
	AppFormValues,
	| 'sortOrder'
	| 'dataTypesText'
	| 'featured'
	| 'published'
	| 'collectsData'
	| 'dataUsedForTracking'
	| 'dataLinkedToIdentity'
> & {
	featured: boolean;
	published: boolean;
	sortOrder: number;
	collectsData: boolean;
	dataUsedForTracking: boolean;
	dataLinkedToIdentity: boolean;
	dataTypes: DataTypeEntry[];
};

export async function draftProject(prompt: string): Promise<ProjectFormValues> {
	const raw = await xaiJson<ProjectRaw>({
		system: `${voice}

Fill a portfolio project form. Summary is one or two sentences. Description is a few short paragraphs, first person, about what the software does and what you built. stack is a comma-separated list. year is 0 if unknown. status is draft, in-progress, shipped, or archived. featured is false unless the prompt says it should be featured. published is true unless the prompt says keep it private.`,
		user: prompt,
		schemaName: 'project_draft',
		schema: projectSchema
	});

	return {
		...defaultProjectFormValues(),
		title: raw.title.trim(),
		slug: slugify(raw.slug || raw.title),
		summary: raw.summary.trim(),
		description: raw.description.trim(),
		author: raw.author.trim() || 'David Dyck',
		role: raw.role.trim(),
		client: raw.client.trim(),
		website: cleanUrl(raw.website),
		github: cleanUrl(raw.github),
		status: projectStatus.includes(raw.status as (typeof projectStatus)[number])
			? raw.status
			: 'shipped',
		year: raw.year > 1990 ? String(raw.year) : '',
		stack: raw.stack.trim(),
		coverUrl: cleanUrl(raw.coverUrl),
		featured: Boolean(raw.featured),
		published: raw.published !== false,
		sortOrder: String(Number.isFinite(raw.sortOrder) ? raw.sortOrder : 0)
	};
}

export async function draftApp(prompt: string): Promise<AppFormValues> {
	const today = new Date().toISOString().slice(0, 10);
	const raw = await xaiJson<AppRaw>({
		system: `${voice}

Fill an App Store listing and privacy page. Write privacyIntro as a short policy in first person (or "this app") that App Store Connect can link to. If the prompt does not mention data collection, assume the app collects nothing, tracking is no, identity linking is no, dataTypes is empty, and say so clearly. If it does collect data, list only the types mentioned, using Apple-style categories (Contact Info, Location, Identifiers, Usage Data, Diagnostics, etc.). childrenPolicy should say the app is not directed at children unless the prompt says otherwise. privacyLastUpdated is today's date (${today}) as YYYY-MM-DD. privacyContactEmail only if given. Leave store URLs, bundle IDs, and icon URLs empty unless provided. platforms is an array of where it runs: ios, ipados, macos, watchos, tvos, visionos, android, android-tv, wearos, android-auto, windows, xbox, linux, web, steam, meta-quest, amazon-fire. platform is the first of those. status is development, in-review, live, or sunset.`,
		user: prompt,
		schemaName: 'app_draft',
		schema: appSchema
	});

	const types = Array.isArray(raw.dataTypes) ? raw.dataTypes : [];
	const collects = Boolean(raw.collectsData) || types.length > 0;

	return {
		name: raw.name.trim(),
		slug: slugify(raw.slug || raw.name),
		tagline: raw.tagline.trim(),
		description: raw.description.trim(),
		platform: primaryPlatform(
			resolvePlatforms({
				platform: raw.platform,
				platforms: Array.isArray(raw.platforms) ? raw.platforms : []
			})
		),
		platforms: resolvePlatforms({
			platform: raw.platform,
			platforms: Array.isArray(raw.platforms) ? raw.platforms : []
		}),
		category: raw.category.trim(),
		bundleId: raw.bundleId.trim(),
		appStoreUrl: cleanUrl(raw.appStoreUrl),
		playStoreUrl: cleanUrl(raw.playStoreUrl),
		website: cleanUrl(raw.website),
		iconUrl: cleanUrl(raw.iconUrl),
		supportUrl: cleanUrl(raw.supportUrl),
		status: appStatus.includes(raw.status as (typeof appStatus)[number])
			? raw.status
			: 'development',
		featured: Boolean(raw.featured),
		published: raw.published !== false,
		sortOrder: String(Number.isFinite(raw.sortOrder) ? raw.sortOrder : 0),
		privacyContactEmail: raw.privacyContactEmail.trim(),
		privacyIntro: raw.privacyIntro.trim(),
		privacyLastUpdated: /^\d{4}-\d{2}-\d{2}$/.test(raw.privacyLastUpdated)
			? raw.privacyLastUpdated
			: today,
		collectsData: collects,
		dataUsedForTracking: Boolean(raw.dataUsedForTracking),
		dataLinkedToIdentity: Boolean(raw.dataLinkedToIdentity),
		dataTypesText: formatDataTypes(types),
		thirdParties: raw.thirdParties.trim(),
		childrenPolicy:
			raw.childrenPolicy.trim() ||
			'This app is not directed at children under 13, and it does not knowingly collect personal information from children.'
	};
}

function cleanUrl(value: string) {
	const trimmed = value.trim();
	if (!trimmed) return '';
	try {
		const url = new URL(trimmed);
		if (url.protocol === 'http:' || url.protocol === 'https:') return url.toString();
	} catch {
		return '';
	}
	return '';
}
