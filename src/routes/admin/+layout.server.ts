import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (url.pathname === '/admin/login') {
		return { email: null };
	}
	if (!locals.admin) {
		redirect(303, '/admin/login');
	}
	return { email: locals.admin.email };
};
