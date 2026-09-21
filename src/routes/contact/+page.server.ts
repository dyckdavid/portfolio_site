import { fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { messages } from '$lib/server/db/schema';
import {
	checkEmail,
	checkMessage,
	createChallenge,
	honeypotFilled,
	rateLimited,
	verifyChallenge
} from '$lib/server/contact-guard';
import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = () => {
	return { challenge: createChallenge() };
};

function clientIp(request: Request, getClientAddress: () => string) {
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0]?.trim() || getClientAddress();
	return getClientAddress();
}

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim().toLowerCase();
		const body = String(data.get('message') ?? '').trim();
		const token = String(data.get('challenge') ?? '');
		const answer = String(data.get('human') ?? '');
		const trap = String(data.get('website') ?? '');

		const challenge = createChallenge();
		const fields = { name, email, message: body, challenge };

		if (honeypotFilled(trap)) {
			return { success: true };
		}

		if (!name || !email || !body) {
			return fail(400, { error: 'All fields are required.', ...fields });
		}

		if (name.length < 2) {
			return fail(400, { error: 'Name must be at least 2 characters.', ...fields });
		}

		if (/https?:\/\//i.test(name)) {
			return fail(400, { error: 'Name cannot include a web address.', ...fields });
		}

		const emailCheck = await checkEmail(email);
		if (!emailCheck.ok) {
			return fail(400, { error: emailCheck.error, ...fields });
		}

		const messageCheck = checkMessage(body);
		if (!messageCheck.ok) {
			return fail(400, { error: messageCheck.error, ...fields });
		}

		const humanError = verifyChallenge(token, answer);
		if (humanError) {
			return fail(400, { error: humanError, ...fields });
		}

		if (rateLimited(clientIp(request, getClientAddress))) {
			return fail(429, {
				error: 'Too many messages from this connection. Try again later.',
				...fields
			});
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
