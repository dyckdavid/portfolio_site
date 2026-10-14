import { error } from '@sveltejs/kit';
import { getAppBySlug } from '$lib/server/apps';
import { renderMarkdown } from '$lib/markdown';
import { formatReleaseDate, listReleaseNotesForApp } from '$lib/server/releases';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, locals }) => {
	const app = await getAppBySlug(params.slug);
	if (!app) error(404, 'Not found');
	if (!app.published && !locals.admin) error(404, 'Not found');

	const notes = await listReleaseNotesForApp(app.id);
	const latest = notes[0] ?? null;

	return {
		app,
		preview: !app.published,
		descriptionHtml: renderMarkdown(app.description),
		latestRelease: latest
			? {
					id: latest.id,
					version: latest.version,
					releaseDateLabel: formatReleaseDate(latest.releaseDate),
					notesHtml: renderMarkdown(latest.notes)
				}
			: null,
		releaseCount: notes.length
	};
};
