import { env } from '$env/dynamic/private';

const XAI_URL = 'https://api.x.ai/v1/chat/completions';

export function xaiConfigured() {
	return Boolean(env.XAI_API_KEY?.trim());
}

export function xaiModel() {
	return env.XAI_MODEL?.trim() || 'grok-4.3';
}

type JsonSchema = Record<string, unknown>;

export async function xaiJson<T>(opts: {
	system: string;
	user: string;
	schemaName: string;
	schema: JsonSchema;
}): Promise<T> {
	const key = env.XAI_API_KEY?.trim();
	if (!key) {
		throw new Error('XAI_API_KEY is not set. Add it to .env.local.');
	}

	const body = {
		model: xaiModel(),
		temperature: 0.3,
		reasoning_effort: 'none',
		messages: [
			{ role: 'system', content: opts.system },
			{ role: 'user', content: opts.user }
		],
		response_format: {
			type: 'json_schema',
			json_schema: {
				name: opts.schemaName,
				schema: opts.schema
			}
		}
	};

	const response = await fetch(XAI_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	const raw = await response.text();
	if (!response.ok) {
		throw new Error(explainXaiError(response.status, raw));
	}

	let parsed: {
		choices?: Array<{ message?: { content?: string } }>;
	};
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new Error('xAI returned something that was not JSON.');
	}

	const content = parsed.choices?.[0]?.message?.content;
	if (!content) {
		throw new Error('xAI returned an empty draft.');
	}

	try {
		return JSON.parse(content) as T;
	} catch {
		throw new Error('xAI returned a draft that was not valid JSON.');
	}
}

function explainXaiError(status: number, raw: string) {
	let message = '';
	try {
		const parsed = JSON.parse(raw) as { error?: { message?: string } | string };
		if (typeof parsed.error === 'string') message = parsed.error;
		if (parsed.error && typeof parsed.error === 'object') {
			message = parsed.error.message ?? '';
		}
	} catch {
		message = raw.slice(0, 240);
	}

	if (status === 401) return 'xAI rejected the API key.';
	if (status === 429) return 'xAI rate-limited the request. Try again in a minute.';
	return message || `xAI request failed (${status}).`;
}
