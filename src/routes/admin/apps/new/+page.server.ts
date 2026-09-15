import { fail, redirect } from '@sveltejs/kit';
import { defaultAppFormValues, parseAppForm, uniqueViolation } from '$lib/server/apps';
import { getDb } from '$lib/server/db';
import { apps } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { values: defaultAppFormValues() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const parsed = await parseAppForm(await request.formData());
		if (parsed.error || !parsed.record) {
			return fail(400, { error: parsed.error ?? 'Could not save.', values: parsed.values });
		}

		const db = getDb();
		let created: { id: string } | undefined;
		try {
			const [row] = await db.insert(apps).values(parsed.record).returning({ id: apps.id });
			created = row;
		} catch (error) {
			if (uniqueViolation(error)) {
				return fail(400, { error: 'That slug is already taken.', values: parsed.values });
			}
			throw error;
		}

		if (!created) {
			return fail(500, { error: 'Could not create the app.', values: parsed.values });
		}

		redirect(303, `/admin/apps/${created.id}`);
	}
};
