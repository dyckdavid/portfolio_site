import { marked } from 'marked';

marked.setOptions({
	gfm: true,
	breaks: false
});

/**
 * Escape raw HTML in Markdown source so only tags emitted by marked are kept.
 * Avoids DOMPurify/jsdom and sanitize-html — both have failed on Vercel Node
 * serverless for this app's /apps/[slug] routes.
 */
function escapeHtmlInMarkdown(source: string): string {
	return source.replace(/</g, '&lt;');
}

/**
 * Render Markdown to HTML (GFM tables, fenced/inline code).
 * Input HTML is escaped before parse; output is marked-generated tags only.
 */
export function renderMarkdown(source: string | null | undefined): string {
	const input = (source ?? '').trim();
	if (!input) return '';

	const raw = marked.parse(escapeHtmlInMarkdown(input), { async: false }) as string;
	// Defense in depth: drop any unexpected tags if marked ever changes.
	return raw.replace(/<(?!\/?(?:a|blockquote|br|code|em|h[1-4]|hr|li|ol|p|pre|strong|table|tbody|td|th|thead|tr|ul)\b)[^>]*>/gi, '');
}
