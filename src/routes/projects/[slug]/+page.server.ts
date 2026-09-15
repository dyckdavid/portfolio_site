import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
	const db = getDb();
	const [project] = await db
		.select()
		.from(projects)
		.where(and(eq(projects.slug, params.slug), eq(projects.published, true)))
		.limit(1);

	if (!project) {
		error(404, 'Not found');
	}

	return { project };
};
