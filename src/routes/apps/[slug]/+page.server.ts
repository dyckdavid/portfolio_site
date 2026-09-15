import { error } from '@sveltejs/kit';
import { getAppBySlug } from '$lib/server/apps';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, locals }) => {
	const app = await getAppBySlug(params.slug);
	if (!app) error(404, 'Not found');
	if (!app.published && !locals.admin) error(404, 'Not found');
	return { app, preview: !app.published };
};
