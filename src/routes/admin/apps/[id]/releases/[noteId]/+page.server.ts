import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { apps, releaseNotes } from '$lib/server/db/schema';
import { getReleaseNote, parseReleaseNoteForm, toReleaseNoteFormValues } from '$lib/server/releases';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const db = getDb();
	const [app] = await db.select().from(apps).where(eq(apps.id, params.id)).limit(1);
	if (!app) error(404, 'App not found');

	const note = await getReleaseNote(app.id, params.noteId);
	if (!note) error(404, 'Release note not found');

	return { app, note, values: toReleaseNoteFormValues(note) };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const db = getDb();
		const note = await getReleaseNote(params.id, params.noteId);
		if (!note) error(404, 'Release note not found');

		const parsed = parseReleaseNoteForm(await request.formData());
		if (parsed.error || !parsed.record) {
			return fail(400, { error: parsed.error ?? 'Could not save.', values: parsed.values });
		}

		const [updated] = await db
			.update(releaseNotes)
			.set({
				version: parsed.record.version,
				releaseDate: parsed.record.releaseDate,
				notes: parsed.record.notes,
				updatedAt: new Date()
			})
			.where(and(eq(releaseNotes.id, params.noteId), eq(releaseNotes.appId, params.id)))
			.returning();

		if (!updated) error(404, 'Release note not found');

		return { saved: true, values: toReleaseNoteFormValues(updated) };
	},

	delete: async ({ params }) => {
		const db = getDb();
		await db
			.delete(releaseNotes)
			.where(and(eq(releaseNotes.id, params.noteId), eq(releaseNotes.appId, params.id)));
		redirect(303, `/admin/apps/${params.id}/releases`);
	}
};
