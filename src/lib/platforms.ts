export const appPlatform = [
	'ios',
	'ipados',
	'macos',
	'watchos',
	'tvos',
	'visionos',
	'android',
	'android-tv',
	'wearos',
	'android-auto',
	'windows',
	'xbox',
	'linux',
	'web',
	'steam',
	'meta-quest',
	'amazon-fire',
	'multi'
] as const;

export type AppPlatformId = (typeof appPlatform)[number];

export type PlatformOption = {
	id: AppPlatformId;
	label: string;
	hint: string;
};

export type PlatformGroup = {
	name: string;
	items: PlatformOption[];
};

export const platformGroups: PlatformGroup[] = [
	{
		name: 'Apple',
		items: [
			{ id: 'ios', label: 'iOS', hint: 'iPhone' },
			{ id: 'ipados', label: 'iPadOS', hint: 'iPad' },
			{ id: 'macos', label: 'macOS', hint: 'Mac' },
			{ id: 'watchos', label: 'watchOS', hint: 'Apple Watch' },
			{ id: 'tvos', label: 'tvOS', hint: 'Apple TV' },
			{ id: 'visionos', label: 'visionOS', hint: 'Apple Vision Pro' }
		]
	},
	{
		name: 'Google',
		items: [
			{ id: 'android', label: 'Android', hint: 'Phone and tablet' },
			{ id: 'android-tv', label: 'Android TV', hint: 'Google TV / Android TV' },
			{ id: 'wearos', label: 'Wear OS', hint: 'Android watches' },
			{ id: 'android-auto', label: 'Android Auto', hint: 'Car' }
		]
	},
	{
		name: 'Microsoft',
		items: [
			{ id: 'windows', label: 'Windows', hint: 'PC' },
			{ id: 'xbox', label: 'Xbox', hint: 'Console' }
		]
	},
	{
		name: 'Other',
		items: [
			{ id: 'web', label: 'Web', hint: 'Browser' },
			{ id: 'linux', label: 'Linux', hint: 'Desktop Linux' },
			{ id: 'steam', label: 'Steam', hint: 'Steam / Steam Deck' },
			{ id: 'meta-quest', label: 'Meta Quest', hint: 'Quest VR' },
			{ id: 'amazon-fire', label: 'Amazon Fire', hint: 'Fire tablet / Fire TV' }
		]
	}
];

export const platformOptions: PlatformOption[] = platformGroups.flatMap((group) => group.items);

const labels: Record<string, string> = Object.fromEntries(
	platformOptions.map((item) => [item.id, item.label])
);
labels.multi = 'Multi-platform';

export function isAppPlatform(value: string): value is AppPlatformId {
	return (appPlatform as readonly string[]).includes(value);
}

export function platformLabel(id: string) {
	return labels[id] ?? id;
}

export function resolvePlatforms(input: {
	platform?: string | null;
	platforms?: string[] | null;
}): AppPlatformId[] {
	const fromArray = (input.platforms ?? []).filter(isAppPlatform).filter((id) => id !== 'multi');
	if (fromArray.length) return unique(fromArray);

	const single = input.platform?.trim() ?? '';
	if (single && isAppPlatform(single) && single !== 'multi') return [single];
	return [];
}

export function formatPlatforms(input: {
	platform?: string | null;
	platforms?: string[] | null;
}) {
	const list = resolvePlatforms(input);
	if (list.length) return list.map(platformLabel).join(', ');
	if (input.platform === 'multi') return 'Multi-platform';
	return platformLabel(input.platform ?? '');
}

export function primaryPlatform(list: string[]): AppPlatformId {
	const first = list.find(isAppPlatform);
	if (first && first !== 'multi') return first;
	return 'ios';
}

function unique(list: AppPlatformId[]) {
	return [...new Set(list)];
}
