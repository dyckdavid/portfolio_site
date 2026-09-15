import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { projectStatus, projects } from '$lib/server/db/schema';
import { parseStack, slugify } from '$lib/server/slug';
import type { Actions } from './$types';

function text(data: FormData, name: string) {
	return String(data.get(name) ?? '').trim();
}

function nullable(data: FormData, name: string) {
	return text(data, name) || null;
}

function checked(data: FormData, name: string) {
	return data.getAll(name).map(String).at(-1) === 'true';
}

function isStatus(value: string): value is (typeof projectStatus)[number] {
	return (projectStatus as readonly string[]).includes(value);
}

function isUniqueViolation(error: unknown) {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code: unknown }).code === '23505'
	);
}

function valuesFrom(data: FormData) {
	return {
		title: String(data.get('title') ?? ''),
		slug: String(data.get('slug') ?? ''),
		summary: String(data.get('summary') ?? ''),
		description: String(data.get('description') ?? ''),
		author: String(data.get('author') ?? ''),
		role: String(data.get('role') ?? ''),
		client: String(data.get('client') ?? ''),
		website: String(data.get('website') ?? ''),
		github: String(data.get('github') ?? ''),
		status: String(data.get('status') ?? 'shipped'),
		year: String(data.get('year') ?? ''),
		stack: String(data.get('stack') ?? ''),
		coverUrl: String(data.get('coverUrl') ?? ''),
		featured: checked(data, 'featured'),
		published: checked(data, 'published'),
		sortOrder: String(data.get('sortOrder') ?? '')
	};
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const values = valuesFrom(data);
		const title = text(data, 'title');
		const status = text(data, 'status') || 'shipped';
		const yearRaw = text(data, 'year');
		const year = yearRaw ? Number.parseInt(yearRaw, 10) : null;
		const sortRaw = text(data, 'sortOrder');
		const sortOrder = sortRaw ? Number.parseInt(sortRaw, 10) : 0;
		const slug = slugify(text(data, 'slug') || title);

		if (!title) {
			return fail(400, { error: 'A title is required.', ...values });
		}
		if (!slug) {
			return fail(400, { error: 'Give it a title we can turn into a slug.', ...values });
		}
		if (!isStatus(status)) {
			return fail(400, { error: 'Pick a valid status.', ...values });
		}

		const db = getDb();
		const taken = await db
			.select({ id: projects.id })
			.from(projects)
			.where(eq(projects.slug, slug))
			.limit(1);

		if (taken[0]) {
			return fail(400, { error: 'That slug is already taken.', ...values });
		}

		try {
			await db.insert(projects).values({
				title,
				slug,
				summary: nullable(data, 'summary'),
				description: nullable(data, 'description'),
				author: text(data, 'author') || 'David Dyck',
				role: nullable(data, 'role'),
				client: nullable(data, 'client'),
				website: nullable(data, 'website'),
				github: nullable(data, 'github'),
				status,
				year: year !== null && Number.isFinite(year) ? year : null,
				stack: parseStack(String(data.get('stack') ?? '')),
				coverUrl: nullable(data, 'coverUrl'),
				featured: checked(data, 'featured'),
				published: checked(data, 'published'),
				sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0
			});
		} catch (error) {
			if (isUniqueViolation(error)) {
				return fail(400, { error: 'That slug is already taken.', ...values });
			}
			throw error;
		}

		redirect(303, '/admin/projects');
	}
};
