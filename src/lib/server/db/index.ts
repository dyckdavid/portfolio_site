import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

function getUrl() {
	const url = env.DATABASE_URL;
	if (!url) {
		throw new Error('DATABASE_URL is not set');
	}
	return url;
}

export function getDb() {
	const sql = neon(getUrl());
	return drizzle(sql, { schema });
}
