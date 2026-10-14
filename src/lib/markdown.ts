import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

marked.setOptions({
	gfm: true,
	breaks: false
});

const ALLOWED_TAGS = [
	'a',
	'blockquote',
	'br',
	'code',
	'em',
	'h1',
	'h2',
	'h3',
	'h4',
	'hr',
	'li',
	'ol',
	'p',
	'pre',
	'strong',
	'table',
	'tbody',
	'td',
	'th',
	'thead',
	'tr',
	'ul'
];

const ALLOWED_ATTR: Record<string, string[]> = {
	a: ['href', 'title', 'target', 'rel'],
	td: ['colspan', 'rowspan'],
	th: ['colspan', 'rowspan']
};

/**
 * Render Markdown to sanitized HTML (GFM tables, fenced/inline code).
 * Uses sanitize-html (pure JS) so SSR works on Vercel Node serverless —
 * isomorphic-dompurify/jsdom crashes there.
 */
export function renderMarkdown(source: string | null | undefined): string {
	const input = (source ?? '').trim();
	if (!input) return '';

	const raw = marked.parse(input, { async: false }) as string;
	return sanitizeHtml(raw, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: ALLOWED_ATTR,
		allowedSchemes: ['http', 'https', 'mailto'],
		transformTags: {
			a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' })
		}
	});
}
