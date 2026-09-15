import {
	boolean,
	integer,
	jsonb,
	pgSchema,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';

export const portfolio = pgSchema('portfolio');

export const projectStatus = ['draft', 'in-progress', 'shipped', 'archived'] as const;
export const appStatus = ['development', 'in-review', 'live', 'sunset'] as const;
export const appPlatform = ['ios', 'android', 'macos', 'web', 'multi'] as const;

export type DataTypeEntry = {
	category: string;
	types: string;
	purpose: string;
	linkedToUser: boolean;
	usedForTracking: boolean;
};

export const projects = portfolio.table('projects', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	summary: text('summary'),
	description: text('description'),
	author: text('author').notNull().default('David Dyck'),
	role: text('role'),
	client: text('client'),
	website: text('website'),
	github: text('github'),
	status: text('status').notNull().default('shipped'),
	year: integer('year'),
	stack: text('stack').array().notNull().default([]),
	coverUrl: text('cover_url'),
	featured: boolean('featured').notNull().default(false),
	published: boolean('published').notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const apps = portfolio.table('apps', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	tagline: text('tagline'),
	description: text('description'),
	platform: text('platform').notNull().default('ios'),
	category: text('category'),
	bundleId: text('bundle_id'),
	appStoreUrl: text('app_store_url'),
	playStoreUrl: text('play_store_url'),
	website: text('website'),
	iconUrl: text('icon_url'),
	supportUrl: text('support_url'),
	status: text('status').notNull().default('development'),
	featured: boolean('featured').notNull().default(false),
	published: boolean('published').notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0),
	privacyContactEmail: text('privacy_contact_email'),
	privacyIntro: text('privacy_intro'),
	privacyLastUpdated: timestamp('privacy_last_updated', { withTimezone: true }),
	collectsData: boolean('collects_data').notNull().default(false),
	dataUsedForTracking: boolean('data_used_for_tracking').notNull().default(false),
	dataLinkedToIdentity: boolean('data_linked_to_identity').notNull().default(false),
	dataTypes: jsonb('data_types').$type<DataTypeEntry[]>().notNull().default([]),
	thirdParties: text('third_parties'),
	childrenPolicy: text('children_policy'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const messages = portfolio.table('messages', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	body: text('body').notNull(),
	read: boolean('read').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type App = typeof apps.$inferSelect;
export type NewApp = typeof apps.$inferInsert;
export type Message = typeof messages.$inferSelect;
