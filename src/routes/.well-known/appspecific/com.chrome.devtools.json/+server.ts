import { json, type RequestHandler } from '@sveltejs/kit';

// Handle Chrome DevTools well-known request
// This is a harmless request from Chrome DevTools that doesn't need to return anything
export const GET: RequestHandler = async () => {
	// Return empty JSON object to satisfy the request
	return json({}, { status: 200 });
};

