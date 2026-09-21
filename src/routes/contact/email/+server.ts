import { json } from '@sveltejs/kit';
import { checkEmail } from '$lib/server/contact-guard';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	let email = '';
	const contentType = request.headers.get('content-type') ?? '';

	if (contentType.includes('application/json')) {
		const body = (await request.json().catch(() => ({}))) as { email?: string };
		email = String(body.email ?? '');
	} else {
		const data = await request.formData();
		email = String(data.get('email') ?? '');
	}

	const result = await checkEmail(email);
	if (!result.ok) return json({ ok: false, error: result.error }, { status: 400 });
	return json({ ok: true });
};
