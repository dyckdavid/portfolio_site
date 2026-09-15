import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

export const SESSION_COOKIE = 'dd_admin';
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

function secret() {
	const value = env.AUTH_SECRET;
	if (!value) throw new Error('AUTH_SECRET is not set');
	return value;
}

export function adminCredentials() {
	const email = env.ADMIN_EMAIL?.trim().toLowerCase();
	const password = env.ADMIN_PASSWORD;
	if (!email || !password) {
		throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
	}
	return { email, password };
}

export function verifyPassword(email: string, password: string) {
	const expected = adminCredentials();
	const emailOk = safeEqual(email.trim().toLowerCase(), expected.email);
	const passOk = safeEqual(password, expected.password);
	return emailOk && passOk;
}

function safeEqual(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	if (left.length !== right.length) {
		timingSafeEqual(left, Buffer.alloc(left.length));
		return false;
	}
	return timingSafeEqual(left, right);
}

export function createSessionToken(email: string) {
	const payload = Buffer.from(
		JSON.stringify({ email, exp: Date.now() + MAX_AGE_MS })
	).toString('base64url');
	const sig = createHmac('sha256', secret()).update(payload).digest('base64url');
	return `${payload}.${sig}`;
}

export function readSessionToken(token: string | undefined): { email: string } | null {
	if (!token || !token.includes('.')) return null;
	const [payload, sig] = token.split('.');
	if (!payload || !sig) return null;
	const expected = createHmac('sha256', secret()).update(payload).digest('base64url');
	try {
		if (!safeEqual(sig, expected)) return null;
	} catch {
		return null;
	}
	try {
		const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
			email?: string;
			exp?: number;
		};
		if (!data.email || !data.exp || data.exp < Date.now()) return null;
		return { email: data.email };
	} catch {
		return null;
	}
}

export const sessionCookieOptions = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: false,
	maxAge: Math.floor(MAX_AGE_MS / 1000)
};
