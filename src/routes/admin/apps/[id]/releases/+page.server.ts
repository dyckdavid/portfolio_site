import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { apps, releaseNotes } from '$lib/server/db/schema';
import {
	defaultReleaseNoteFormValues,
	formatReleaseDate,
	listReleaseNotesForApp,
	parseReleaseNoteForm
} from '$lib/server/releases';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const db = getDb();
	const [app] = await db.select().from(apps).where(eq(apps.id, params.id)).limit(1);
	if (!app) error(404, 'App not found');

	const notes = await listReleaseNotesForApp(app.id);
	return {
		app,
		notes: notes.map((note) => ({
			...note,
			releaseDateLabel: formatReleaseDate(note.releaseDate)
		})),
		values: defaultReleaseNoteFormValues()
	};
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const db = getDb();
		const [app] = await db.select().from(apps).where(eq(apps.id, params.id)).limit(1);
		if (!app) error(404, 'App not found');

		const parsed = parseReleaseNoteForm(await request.formData());
		if (parsed.error || !parsed.record) {
			return fail(400, { error: parsed.error ?? 'Could not save.', values: parsed.values });
		}

		await db.insert(releaseNotes).values({
			appId: app.id,
			version: parsed.record.version,
			releaseDate: parsed.record.releaseDate,
			notes: parsed.record.notes
		});

		redirect(303, `/admin/apps/${app.id}/releases`);
	},

	delete: async ({ request, params }) => {
		const db = getDb();
		const form = await request.formData();
		const noteId = String(form.get('id') ?? '');
		if (!noteId) return fail(400, { error: 'Missing release note id.' });

		await db
			.delete(releaseNotes)
			.where(eq(releaseNotes.id, noteId));

		redirect(303, `/admin/apps/${params.id}/releases`);
	}
};
