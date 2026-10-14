import { error } from '@sveltejs/kit';
import { getAppBySlug } from '$lib/server/apps';
import { renderMarkdown } from '$lib/markdown';
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
	try {
		const app = await getAppBySlug(params.slug);
		if (!app) error(404, 'Not found');
		if (!app.published && !locals.admin) error(404, 'Not found');

		const customHtml = app.customPrivacyOnly
			? renderMarkdown(app.privacyBody || app.privacyIntro)
			: renderMarkdown(app.privacyIntro);
		const thirdPartiesHtml = renderMarkdown(app.thirdParties);
		const childrenHtml = renderMarkdown(app.childrenPolicy);

		return {
			app,
			preview: !app.published,
			lastUpdated: formatDate(app.privacyLastUpdated),
			customPrivacyOnly: app.customPrivacyOnly,
			customHtml,
			thirdPartiesHtml,
			childrenHtml
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		const message = err instanceof Error ? err.message : String(err);
		console.error('apps/[slug]/privacy load failed', err);
		error(500, message);
	}
};
