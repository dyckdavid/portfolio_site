import { json } from '@sveltejs/kit';
import { draftApp, draftProject } from '$lib/server/ai-draft';
import { xaiConfigured, xaiModel } from '$lib/server/xai';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.admin) {
		return json({ error: 'Not signed in.' }, { status: 401 });
	}

	let body: { kind?: string; prompt?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Send JSON with kind and prompt.' }, { status: 400 });
	}

	const kind = body.kind === 'app' ? 'app' : body.kind === 'project' ? 'project' : null;
	const prompt = String(body.prompt ?? '').trim();

	if (!kind) {
		return json({ error: 'kind must be project or app.' }, { status: 400 });
	}
	if (prompt.length < 12) {
		return json({ error: 'Give the model a bit more to work with.' }, { status: 400 });
	}
	if (prompt.length > 8000) {
		return json({ error: 'Keep the prompt under 8,000 characters.' }, { status: 400 });
	}
	if (!xaiConfigured()) {
		return json(
			{ error: 'Add XAI_API_KEY to .env.local, then restart the dev server.' },
			{ status: 503 }
		);
	}

	try {
		if (kind === 'project') {
			return json({ kind, model: xaiModel(), project: await draftProject(prompt) });
		}
		return json({ kind, model: xaiModel(), app: await draftApp(prompt) });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Draft failed.';
		return json({ error: message }, { status: 502 });
	}
};
