import { asc, desc, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { apps } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async () => {
	const db = getDb();
	const rows = await db
		.select()
		.from(apps)
		.where(eq(apps.published, true))
		.orderBy(desc(apps.featured), asc(apps.sortOrder), asc(apps.name));
	return { apps: rows };
};
