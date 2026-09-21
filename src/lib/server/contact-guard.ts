import { createHmac, timingSafeEqual } from 'node:crypto';
import { resolve4, resolve6, resolveMx } from 'node:dns/promises';
import { env } from '$env/dynamic/private';

const CHALLENGE_TTL_MS = 30 * 60 * 1000;
const MIN_SUBMIT_MS = 2500;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;

const emailSyntax =
	/^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const disposableDomains = new Set([
	'10minutemail.com',
	'guerrillamail.com',
	'guerrillamail.net',
	'mailinator.com',
	'tempmail.com',
	'temp-mail.org',
	'throwaway.email',
	'yopmail.com',
	'trashmail.com',
	'getnada.com',
	'maildrop.cc',
	'dispostable.com',
	'fakeinbox.com',
	'sharklasers.com',
	'grr.la',
	'guerrillamailblock.com',
	'mailnesia.com',
	'tempail.com',
	'emailondeck.com',
	'moakt.com',
	'inboxkitten.com',
	'mailcatch.com',
	'mytemp.email',
	'trashmail.de',
	'discard.email',
	'mailnull.com',
	'spamgourmet.com',
	'tempinbox.com',
	'minuteinbox.com',
	'getairmail.com'
]);

const recentByIp = new Map<string, number[]>();

export type Challenge = {
	token: string;
	prompt: string;
};

function secret() {
	return env.AUTH_SECRET || env.DATABASE_URL || 'contact-form-dev';
}

function sign(payload: string) {
	return createHmac('sha256', secret()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	if (left.length !== right.length) return false;
	return timingSafeEqual(left, right);
}

export function createChallenge(): Challenge {
	const a = 2 + Math.floor(Math.random() * 8);
	const b = 2 + Math.floor(Math.random() * 8);
	const issued = Date.now();
	const payload = `${a}.${b}.${issued}`;
	return {
		token: `${payload}.${sign(payload)}`,
		prompt: `What is ${a} + ${b}?`
	};
}

export function verifyChallenge(token: string, answer: string): string | null {
	const parts = token.split('.');
	if (parts.length !== 4) return 'Confirm you are a person and try again.';

	const [aRaw, bRaw, issuedRaw, mac] = parts;
	if (!safeEqual(mac, sign(`${aRaw}.${bRaw}.${issuedRaw}`))) {
		return 'Confirm you are a person and try again.';
	}

	const issued = Number(issuedRaw);
	if (!Number.isFinite(issued) || Date.now() - issued > CHALLENGE_TTL_MS) {
		return 'That check expired. Add the new numbers and send again.';
	}

	if (Date.now() - issued < MIN_SUBMIT_MS) {
		return 'That was too quick. Wait a moment and send again.';
	}

	const expected = Number(aRaw) + Number(bRaw);
	const given = Number(String(answer).replace(/[^\d-]/g, ''));
	if (!Number.isFinite(given) || given !== expected) {
		return 'The human check is wrong. Add the numbers shown and try again.';
	}

	return null;
}

export function honeypotFilled(value: string) {
	return value.trim().length > 0;
}

export function rateLimited(ip: string) {
	const now = Date.now();
	const recent = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
	if (recent.length >= RATE_MAX) {
		recentByIp.set(ip, recent);
		return true;
	}
	recent.push(now);
	recentByIp.set(ip, recent);
	return false;
}

function rootDomain(host: string) {
	const parts = host.split('.');
	if (parts.length < 2) return host;
	return parts.slice(-2).join('.');
}

export async function checkEmail(raw: string): Promise<{ ok: true } | { ok: false; error: string }> {
	const email = raw.trim().toLowerCase();
	if (!email) return { ok: false, error: 'Please enter an email address.' };
	if (email.length > 254) return { ok: false, error: 'That email is too long.' };
	if (!emailSyntax.test(email) || email.includes('..')) {
		return { ok: false, error: 'That does not look like a real email address.' };
	}

	const [local, domain] = email.split('@');
	if (!local || !domain || local.length > 64) {
		return { ok: false, error: 'That does not look like a real email address.' };
	}

	if (disposableDomains.has(domain) || disposableDomains.has(rootDomain(domain))) {
		return { ok: false, error: 'Use a lasting email, not a throwaway inbox.' };
	}

	const dns = await lookupMailHost(domain);
	if (dns === 'ok') return { ok: true };
	if (dns === 'missing') {
		return { ok: false, error: 'No mail server found for that email domain.' };
	}

	return { ok: true };
}

function dnsMissing(err: unknown) {
	const code = typeof err === 'object' && err && 'code' in err ? String(err.code) : '';
	return code === 'ENOTFOUND' || code === 'ENODATA' || code === 'ENOTIMP';
}

async function lookupMailHost(domain: string): Promise<'ok' | 'missing' | 'unknown'> {
	try {
		const mx = await resolveMx(domain);
		if (mx.some((record) => record.exchange)) return 'ok';
	} catch (err) {
		if (!dnsMissing(err)) return 'unknown';
	}

	try {
		const [v4, v6] = await Promise.allSettled([resolve4(domain), resolve6(domain)]);
		if (v4.status === 'fulfilled' && v4.value.length > 0) return 'ok';
		if (v6.status === 'fulfilled' && v6.value.length > 0) return 'ok';

		const missingA = v4.status === 'rejected' && dnsMissing(v4.reason);
		const missingAAAA = v6.status === 'rejected' && dnsMissing(v6.reason);
		if (missingA && missingAAAA) return 'missing';
		if (v4.status === 'rejected' || v6.status === 'rejected') return 'unknown';
		return 'missing';
	} catch {
		return 'unknown';
	}
}

export { checkMessage } from '$lib/contact-message';
