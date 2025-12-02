import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Handle Chrome DevTools well-known requests gracefully
	if (event.url.pathname.startsWith('/.well-known/')) {
		// Return empty response for well-known paths that don't exist
		return new Response(JSON.stringify({}), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return resolve(event);
};

