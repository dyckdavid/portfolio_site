import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	SESSION_COOKIE,
	createSessionToken,
	sessionCookieOptions,
	verifyPassword
} from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.admin) redirect(303, '/admin');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '');
		const password = String(data.get('password') ?? '');

		if (!verifyPassword(email, password)) {
			return fail(400, { error: 'That email or password is wrong.' });
		}

		cookies.set(SESSION_COOKIE, createSessionToken(email.trim().toLowerCase()), {
			...sessionCookieOptions,
			secure: url.protocol === 'https:'
		});

		redirect(303, '/admin');
	}
};
