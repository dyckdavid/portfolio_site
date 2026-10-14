import { json } from '@sveltejs/kit';
import { renderMarkdown } from '$lib/markdown';
import type { RequestHandler } from './$types';

/** Temporary production probe for Markdown SSR — remove after routes are healthy. */
export const GET: RequestHandler = async () => {
	try {
		const html = renderMarkdown('**smoke** | a |\n|---|\n| 1 |');
		return json({
			ok: true,
			node: process.version,
			html
		});
	} catch (err) {
		return json(
			{
				ok: false,
				node: process.version,
				error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
				stack: err instanceof Error ? err.stack : undefined
			},
			{ status: 500 }
		);
	}
};
