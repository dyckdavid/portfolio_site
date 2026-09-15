import { error } from '@sveltejs/kit';
import { getAppBySlug } from '$lib/server/apps';
import type { PageServerLoad } from './$types';

export const prerender = false;

function formatDate(value: Date | string | null) {
	if (!value) return null;
	const date = typeof value === 'string' ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return null;
	return date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const app = await getAppBySlug(params.slug);
	if (!app) error(404, 'Not found');
	if (!app.published && !locals.admin) error(404, 'Not found');
	return {
		app,
		preview: !app.published,
		lastUpdated: formatDate(app.privacyLastUpdated)
	};
};
