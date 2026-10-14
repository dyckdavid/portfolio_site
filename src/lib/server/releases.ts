import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { releaseNotes, type ReleaseNote } from '$lib/server/db/schema';

export type ReleaseNoteFormValues = {
	version: string;
	releaseDate: string;
	notes: string;
};

export function defaultReleaseNoteFormValues(): ReleaseNoteFormValues {
	return { version: '', releaseDate: '', notes: '' };
}

export function toReleaseNoteFormValues(note: ReleaseNote): ReleaseNoteFormValues {
	return {
		version: note.version,
		releaseDate: String(note.releaseDate).slice(0, 10),
		notes: note.notes ?? ''
	};
}

function str(form: FormData, key: string) {
	return String(form.get(key) ?? '').trim();
}

export function parseReleaseNoteForm(form: FormData): {
	values: ReleaseNoteFormValues;
	error?: string;
	record?: { version: string; releaseDate: string; notes: string };
} {
	const values: ReleaseNoteFormValues = {
		version: str(form, 'version'),
		releaseDate: str(form, 'releaseDate'),
		notes: String(form.get('notes') ?? '').trim()
	};

	if (!values.version) {
		return { values, error: 'Version is required.' };
	}
	if (!values.releaseDate) {
		return { values, error: 'Release date is required.' };
	}
	const parsed = new Date(`${values.releaseDate}T12:00:00.000Z`);
	if (Number.isNaN(parsed.getTime())) {
		return { values, error: 'Release date is not valid.' };
	}

	return {
		values,
		record: {
			version: values.version,
			releaseDate: values.releaseDate,
			notes: values.notes
		}
	};
}

export async function listReleaseNotesForApp(appId: string) {
	const db = getDb();
	return db
		.select()
		.from(releaseNotes)
		.where(eq(releaseNotes.appId, appId))
		.orderBy(desc(releaseNotes.releaseDate), desc(releaseNotes.createdAt));
}

export async function getReleaseNote(appId: string, noteId: string) {
	const db = getDb();
	const [note] = await db
		.select()
		.from(releaseNotes)
		.where(and(eq(releaseNotes.id, noteId), eq(releaseNotes.appId, appId)))
		.limit(1);
	return note ?? null;
}

export function formatReleaseDate(value: string | Date | null | undefined) {
	if (!value) return '';
	const iso = typeof value === 'string' ? value : value.toISOString();
	const date = new Date(`${iso.slice(0, 10)}T12:00:00.000Z`);
	if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
	return new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(date);
}
