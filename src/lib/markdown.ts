import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

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

const ALLOWED_ATTR = ['href', 'title', 'target', 'rel', 'colspan', 'rowspan'];

/**
 * Render Markdown to sanitized HTML (GFM tables, fenced/inline code).
 */
export function renderMarkdown(source: string | null | undefined): string {
	const input = (source ?? '').trim();
	if (!input) return '';

	const raw = marked.parse(input, { async: false }) as string;
	return DOMPurify.sanitize(raw, {
		ALLOWED_TAGS,
		ALLOWED_ATTR,
		ALLOW_DATA_ATTR: false
	});
}
