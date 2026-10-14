-- Additive: download metadata, custom privacy toggle/body, release_notes table.
ALTER TABLE portfolio.apps
	ADD COLUMN IF NOT EXISTS download_url text,
	ADD COLUMN IF NOT EXISTS sha256 text,
	ADD COLUMN IF NOT EXISTS version text,
	ADD COLUMN IF NOT EXISTS file_size text,
	ADD COLUMN IF NOT EXISTS requirements text,
	ADD COLUMN IF NOT EXISTS custom_privacy_only boolean NOT NULL DEFAULT false,
	ADD COLUMN IF NOT EXISTS privacy_body text;

CREATE TABLE IF NOT EXISTS portfolio.release_notes (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	app_id uuid NOT NULL REFERENCES portfolio.apps(id) ON DELETE CASCADE,
	version text NOT NULL,
	release_date date NOT NULL,
	notes text NOT NULL DEFAULT '',
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS release_notes_app_id_idx
	ON portfolio.release_notes (app_id);

CREATE INDEX IF NOT EXISTS release_notes_app_release_date_idx
	ON portfolio.release_notes (app_id, release_date DESC);
