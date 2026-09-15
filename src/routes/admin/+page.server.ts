import { desc, eq, count, sql } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { projects, apps, messages } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

function formatDate(value: Date | string) {
	const date = value instanceof Date ? value : new Date(value);
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	}).format(date);
}

export const load: PageServerLoad = async () => {
	const db = getDb();

	const [projectCount, appCount, unreadCount, messageCount, recentMessages, recentProjects, recentApps] =
		await Promise.all([
			db.select({ n: count() }).from(projects),
			db.select({ n: count() }).from(apps),
			db.select({ n: count() }).from(messages).where(eq(messages.read, false)),
			db.select({ n: count() }).from(messages),
			db
				.select({
					id: messages.id,
					name: messages.name,
					email: messages.email,
					createdAt: messages.createdAt
				})
				.from(messages)
				.orderBy(desc(messages.createdAt))
				.limit(5),
			db
				.select({
					id: projects.id,
					title: projects.title,
					status: projects.status,
					published: projects.published
				})
				.from(projects)
				.orderBy(desc(projects.createdAt))
				.limit(5),
			db
				.select({
					id: apps.id,
					name: apps.name,
					status: apps.status,
					published: apps.published
				})
				.from(apps)
				.orderBy(desc(apps.createdAt))
				.limit(5)
		]);

	return {
		counts: {
			projects: Number(projectCount[0]?.n ?? 0),
			apps: Number(appCount[0]?.n ?? 0),
			unread: Number(unreadCount[0]?.n ?? 0),
			messages: Number(messageCount[0]?.n ?? 0)
		},
		recentMessages: recentMessages.map((m) => ({
			...m,
			createdAt: formatDate(m.createdAt)
		})),
		recentProjects,
		recentApps
	};
};
