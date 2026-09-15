import { fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { messages } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const prerender = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim().toLowerCase();
		const body = String(data.get('message') ?? '').trim();

		const fields = { name, email, message: body };

		if (!name || !email || !body) {
			return fail(400, { error: 'All fields are required.', ...fields });
		}

		if (name.length < 2) {
			return fail(400, { error: 'Name must be at least 2 characters.', ...fields });
		}

		if (!emailPattern.test(email)) {
			return fail(400, { error: 'Please enter a valid email address.', ...fields });
		}

		if (body.length < 10) {
			return fail(400, { error: 'Message must be at least 10 characters.', ...fields });
		}

		try {
			const db = getDb();
			await db.insert(messages).values({ name, email, body });
			return { success: true };
		} catch (err) {
			console.error('Error saving contact message:', err);
			return fail(500, { error: 'Failed to send. Please try again.', ...fields });
		}
	}
};
