const VOWELS = /[aeiouy]/i;
const LETTER = /[a-z]/i;

export function checkMessage(raw: string): { ok: true } | { ok: false; error: string } {
	const body = raw.trim();
	if (!body) return { ok: false, error: 'Please write a message.' };
	if (body.length < 10) return { ok: false, error: 'Message must be at least 10 characters.' };

	const links = body.match(/https?:\/\/[^\s]+/gi) ?? [];
	if (links.length >= 5) return { ok: false, error: 'That message has too many links.' };

	const tokens = body
		.split(/[^\p{L}\p{N}'+.-]+/u)
		.map((token) => token.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, ''))
		.filter((token) => token.length >= 6);

	const junk = tokens.filter(isGibberishToken);
	const junkLetters = junk.reduce((sum, token) => sum + token.length, 0);
	const allLetters = (body.match(/[a-z0-9]/gi) ?? []).length;
	const junkShare = allLetters ? junkLetters / allLetters : 0;

	if (junk.length >= 2 || junkShare >= 0.45 || (tokens.length <= 2 && junk.length === 1)) {
		return {
			ok: false,
			error: 'That looks like random letters. Write a short note in plain words.'
		};
	}

	return { ok: true };
}

function isGibberishToken(token: string) {
	if (/https?:\/\//i.test(token) || token.includes('.')) return false;
	if (token.length < 8) return false;

	const letters = [...token].filter((ch) => LETTER.test(ch));
	if (letters.length < 8) return false;

	const vowels = letters.filter((ch) => VOWELS.test(ch)).length;
	const vowelRatio = vowels / letters.length;
	if (vowelRatio < 0.15) return true;

	if (/[bcdfghjklmnpqrstvwxz]{6,}/i.test(token)) return true;

	let flips = 0;
	for (let i = 1; i < letters.length; i += 1) {
		const prev = letters[i - 1];
		const next = letters[i];
		if (!prev || !next) continue;
		if ((prev === prev.toUpperCase()) !== (next === next.toUpperCase())) flips += 1;
	}

	const flipRate = flips / (letters.length - 1);
	return flips >= 4 && flipRate >= 0.22;
}
