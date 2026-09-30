export type SupportSection = {
	heading: string;
	body: string;
};

/** True when the value looks like a real email, not a placeholder. */
export function isRealSupportEmail(value: string | null | undefined) {
	if (!value) return false;
	const trimmed = value.trim();
	if (!trimmed) return false;
	if (/your\s+support\s+email|placeholder|example\.(com|org)|noreply@/i.test(trimmed)) return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Split a support body into ## sections. Text section body keeps blank-line
 * paragraph breaks; inline [label](href) links are left for the page to render.
 */
export function parseSupportBody(raw: string | null | undefined): SupportSection[] {
	if (!raw?.trim()) return [];

	const lines = raw.replace(/\r\n/g, '\n').split('\n');
	const sections: SupportSection[] = [];
	let heading = '';
	let bodyLines: string[] = [];

	const flush = () => {
		const body = bodyLines.join('\n').trim();
		if (!heading && !body) return;
		sections.push({ heading: heading || 'Notes', body });
		heading = '';
		bodyLines = [];
	};

	for (const line of lines) {
		const match = /^##\s+(.+)$/.exec(line);
		if (match) {
			flush();
			heading = match[1].trim();
			continue;
		}
		bodyLines.push(line);
	}
	flush();

	return sections;
}

export type InlinePart =
	| { type: 'text'; text: string }
	| { type: 'link'; label: string; href: string };

/** Split a paragraph into text and markdown-style links. */
export function parseInlineParts(text: string): InlinePart[] {
	const parts: InlinePart[] = [];
	const re = /\[([^\]]+)\]\(([^)]+)\)/g;
	let last = 0;
	let match: RegExpExecArray | null;
	while ((match = re.exec(text))) {
		if (match.index > last) {
			parts.push({ type: 'text', text: text.slice(last, match.index) });
		}
		parts.push({ type: 'link', label: match[1], href: match[2] });
		last = match.index + match[0].length;
	}
	if (last < text.length) {
		parts.push({ type: 'text', text: text.slice(last) });
	}
	return parts.length ? parts : [{ type: 'text', text }];
}

export function supportParagraphs(body: string) {
	return body
		.split(/\n{2,}/)
		.map((part) => part.trim())
		.filter(Boolean);
}
