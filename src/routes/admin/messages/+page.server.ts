import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { messages } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

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

function messageId(data: FormData) {
	const id = String(data.get('id') ?? '').trim();
	return id || null;
}

export const load: PageServerLoad = async () => {
	const db = getDb();
	const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));

	return {
		messages: rows.map((m) => ({
			id: m.id,
			name: m.name,
			email: m.email,
			body: m.body,
			read: m.read,
			createdAt: formatDate(m.createdAt)
		}))
	};
};

export const actions: Actions = {
	markRead: async ({ request }) => {
		const id = messageId(await request.formData());
		if (!id) return fail(400, { error: 'Missing message.' });

		const db = getDb();
		await db.update(messages).set({ read: true }).where(eq(messages.id, id));
	},

	markUnread: async ({ request }) => {
		const id = messageId(await request.formData());
		if (!id) return fail(400, { error: 'Missing message.' });

		const db = getDb();
		await db.update(messages).set({ read: false }).where(eq(messages.id, id));
	},

	delete: async ({ request }) => {
		const id = messageId(await request.formData());
		if (!id) return fail(400, { error: 'Missing message.' });

		const db = getDb();
		await db.delete(messages).where(eq(messages.id, id));
	}
};
