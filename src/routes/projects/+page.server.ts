import { asc, desc, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async () => {
	const db = getDb();
	const rows = await db
		.select()
		.from(projects)
		.where(eq(projects.published, true))
		.orderBy(
			desc(projects.featured),
			asc(projects.sortOrder),
			desc(projects.year),
			desc(projects.createdAt)
		);

	return { projects: rows };
};
