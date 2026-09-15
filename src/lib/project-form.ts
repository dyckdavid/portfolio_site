export type ProjectFormValues = {
	title: string;
	slug: string;
	summary: string;
	description: string;
	author: string;
	role: string;
	client: string;
	website: string;
	github: string;
	status: string;
	year: string;
	stack: string;
	coverUrl: string;
	featured: boolean;
	published: boolean;
	sortOrder: string;
};

export function defaultProjectFormValues(): ProjectFormValues {
	return {
		title: '',
		slug: '',
		summary: '',
		description: '',
		author: 'David Dyck',
		role: '',
		client: '',
		website: '',
		github: '',
		status: 'shipped',
		year: '',
		stack: '',
		coverUrl: '',
		featured: false,
		published: true,
		sortOrder: '0'
	};
}
