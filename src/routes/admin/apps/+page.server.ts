import { fail } from '@sveltejs/kit';
import { asc, desc, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { apps } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const db = getDb();
	const rows = await db
		.select()
		.from(apps)
		.orderBy(desc(apps.featured), asc(apps.sortOrder), asc(apps.name));
	return { apps: rows };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '').trim();
		if (!id) return fail(400, { error: 'Missing app.' });
		const db = getDb();
		await db.delete(apps).where(eq(apps.id, id));
		return { deleted: true };
	}
};
