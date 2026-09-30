-- Add per-app support page fields (mirrors privacy_* content fields).
ALTER TABLE portfolio.apps
	ADD COLUMN IF NOT EXISTS support_contact_email text,
	ADD COLUMN IF NOT EXISTS support_intro text,
	ADD COLUMN IF NOT EXISTS support_body text;

-- Seed Bookwell support copy when that app exists.
UPDATE portfolio.apps
SET
	support_contact_email = COALESCE(NULLIF(support_contact_email, ''), '[YOUR SUPPORT EMAIL HERE]'),
	support_intro = COALESCE(
		NULLIF(support_intro, ''),
		'Bookwell is simple bookkeeping for iPhone, iPad and Mac. Your ledger stays on your devices and in your private iCloud.'
	),
	support_body = COALESCE(
		NULLIF(support_body, ''),
		E'## Getting started\nAdd an account first, then record entries with the Add button. Balances, budgets and reports update as you go. Each account keeps its own currency; amounts are never converted.\n\n## iCloud sync\nSign in to iCloud with the same Apple Account on each device. New entries can take a moment to reach your other devices. Settings ▸ iCloud Sync (iPhone and iPad) or Settings ▸ iCloud (Mac) shows the latest status and diagnostics.\n\n## Siri and Shortcuts\nOn iPhone and iPad, say "Bookwell spending", "Bookwell balance" or "Ask Bookwell". Every Bookwell action is also in Shortcuts. On Mac, Siri runs a shortcut when you say or type its exact name. Open Bookwell ▸ Settings ▸ Siri, click Add Recommended Shortcuts, then Add Shortcut in each Shortcuts window. After about a minute, ask Siri "Check Spending". First time, allow the shortcut to use Bookwell. While App Lock is on, Siri and Shortcuts can''t read or change the ledger.\n\n## Backups\nExport JSON ledger backup from Settings; keep safe. Restore needs empty ledger; Merge adds by ID and stops on conflicts. Backups not encrypted.\n\n## Importing CSV\nColumns: date, title, amount; optional kind, account, category, currency, status. Dates YYYY-MM-DD; amounts decimal point, no currency symbols.\n\n## Privacy\nBookwell collects no data. See the [Privacy Policy](/apps/bookwell/privacy).'
	),
	updated_at = now()
WHERE slug = 'bookwell';
