import { fail } from '@sveltejs/kit';
import { asc, desc, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const db = getDb();
	const rows = await db
		.select({
			id: projects.id,
			title: projects.title,
			status: projects.status,
			year: projects.year,
			published: projects.published,
			featured: projects.featured
		})
		.from(projects)
		.orderBy(asc(projects.sortOrder), desc(projects.year), asc(projects.title));

	return { projects: rows };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '').trim();
		if (!id) return fail(400, { error: 'Missing project.' });

		const db = getDb();
		await db.delete(projects).where(eq(projects.id, id));
		return { ok: true };
	}
};
