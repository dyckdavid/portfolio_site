import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { readSessionToken, SESSION_COOKIE } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/.well-known/')) {
		return new Response(JSON.stringify({}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	event.locals.admin = readSessionToken(event.cookies.get(SESSION_COOKIE));

	const path = event.url.pathname;
	const isAdmin = path === '/admin' || path.startsWith('/admin/');
	const isLogin = path === '/admin/login';

	if (isAdmin && !isLogin && !event.locals.admin) {
		redirect(303, '/admin/login');
	}

	if (isLogin && event.locals.admin && event.request.method === 'GET') {
		redirect(303, '/admin');
	}

	return resolve(event);
};
