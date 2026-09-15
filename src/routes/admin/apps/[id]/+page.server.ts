import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { parseAppForm, toFormValues, uniqueViolation } from '$lib/server/apps';
import { getDb } from '$lib/server/db';
import { apps } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const db = getDb();
	const [app] = await db.select().from(apps).where(eq(apps.id, params.id)).limit(1);
	if (!app) error(404, 'App not found');
	return { app, values: toFormValues(app) };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const db = getDb();
		const [existing] = await db.select().from(apps).where(eq(apps.id, params.id)).limit(1);
		if (!existing) error(404, 'App not found');

		const parsed = await parseAppForm(await request.formData(), { excludeId: params.id });
		if (parsed.error || !parsed.record) {
			return fail(400, { error: parsed.error ?? 'Could not save.', values: parsed.values });
		}

		try {
			const [updated] = await db
				.update(apps)
				.set({ ...parsed.record, updatedAt: new Date() })
				.where(eq(apps.id, params.id))
				.returning();

			if (!updated) {
				error(404, 'App not found');
			}

			return {
				saved: true,
				values: toFormValues(updated),
				privacyUrl: `/apps/${updated.slug}/privacy`
			};
		} catch (err) {
			if (uniqueViolation(err)) {
				return fail(400, { error: 'That slug is already taken.', values: parsed.values });
			}
			throw err;
		}
	},

	delete: async ({ params }) => {
		const db = getDb();
		await db.delete(apps).where(eq(apps.id, params.id));
		redirect(303, '/admin/apps');
	}
};
