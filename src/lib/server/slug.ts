export function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

export function parseStack(value: string) {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}
