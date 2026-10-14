-- Backfill for Neon BRANCH only (preview/apps-downloads-releases-privacy-6716).
-- Do NOT run on production until David approves the merge.
-- Idempotent: safe to re-run (updates by slug; deletes+reinserts known release rows).

-- ---------------------------------------------------------------------------
-- Control Panel v2.0.0 — download metadata + custom privacy + release notes
-- Source: control-panel website content package (attached uploads file)
-- ---------------------------------------------------------------------------

UPDATE portfolio.apps
SET
	download_url = 'https://github.com/dyckdavid/control-panel/releases/latest',
	sha256 = '6f88f0746d78f4037ab39ada9a668997caebee0f99fe37e97a5cd94a778a002e',
	version = '2.0.0',
	file_size = '1.6 MB',
	requirements = 'macOS 27 or later, Apple silicon',
	custom_privacy_only = true,
	privacy_last_updated = '2026-10-14T12:00:00.000Z',
	privacy_body = $cp_privacy$
# Control Panel privacy policy

**Effective date:** October 14, 2026  
**Applies to:** Control Panel for macOS, version 2.0.0 and later

## The short version

Control Panel does not collect, store, or transmit your personal data to the developer, and it has no analytics, advertising, or tracking. Everything the app shows you is read from your own Mac and network and stays on your Mac. The app does talk to a few third-party internet services, but only to do a job you can see, and those are listed in full below.

## What the app reads on your Mac

To show you information, the app reads system details locally. These are displayed to you and never sent anywhere:

- Mac model, chip, serial number, macOS version, uptime, and computer name
- CPU, memory, disk, battery, display, and audio information
- Security status: FileVault, Gatekeeper, System Integrity Protection, and firewall
- Network configuration: IP addresses, router, DNS servers, and network services
- The contents of `/etc/hosts`, when you open Developer Tools
- Sizes of your Desktop, Documents, Downloads, Movies, Music, Pictures, and Caches folders. Only the total sizes are read; file contents are not. macOS may ask your permission for some of these folders.
- Print queues and print jobs
- Wi-Fi network names and nearby networks, if you grant Location access (see Permissions)

## Internet services the app contacts

The app contains exactly four built-in internet addresses. Each receives only what any website receives when you visit it: your public IP address and standard request information. No personal data, device identifiers, or app usage information is sent.

1. **ipify** (`api.ipify.org`) — Automatically, when you open the Network page or press Refresh. Shows your public IP address.
2. **ifconfig.me** — Only if ipify doesn't answer. Backup for the public IP lookup.
3. **icanhazip.com** — Only if the first two don't answer. Second backup for the public IP lookup.
4. **IEEE** (`standards-oui.ieee.org`) — Only if you turn on "Read hardware addresses and vendors" in Device Scanner; at most once every 90 days. Downloads the public registry that matches hardware address prefixes to manufacturers. The whole file is downloaded and looked up on your Mac, so nothing about your devices is sent.

Apple's built-in tools may also contact Apple when you use these features:

- Network Quality runs Apple's networkQuality test against Apple's measurement servers. It starts automatically when you open the Network Quality page, and also runs when you press Run Benchmark, or optionally during Path Diagnostics.

## Connections you start yourself

These tools contact only the host or address you enter, and only when you run them:

- Ping, Path Diagnostics, DNS lookup, Port Check, and HTTP Inspector. DNS lookups go to your normal DNS server, or to one you choose; the app offers Cloudflare (`1.1.1.1`), Google (`8.8.8.8`), and Quad9 (`9.9.9.9`) as one-click options. HTTP Inspector uses a private session that sends and stores no cookies.
- Printing goes directly to the printer you choose, either on your network or at an address you type.

## Your local network

Some features communicate with devices on your own network. This traffic stays on your network:

- Printer discovery and printing use Bonjour, IPP, and raw TCP to reach printers.
- Device Scanner sends small probes (ping, and connection attempts on a few common ports) to each address on your local network, and lists the devices that respond. On some business networks, security systems may notice scans like this, so check before using it on a network you don't manage.
- With "Read hardware addresses and vendors" turned on, the scanner also sends a one-byte message to each local address and then reads your Mac's own network table.

## Data stored on your Mac

- **Manufacturer lookup table:** a copy of the public IEEE registry, saved only if you use that feature, in `~/Library/Application Support/com.daviddyck.control-panel/`. It contains no information about you or your devices. Delete that folder to remove it.
- **Files you save:** reports and output, saved only where you choose.
- **Temporary files:** created briefly while printing or saving the hosts file, and deleted immediately afterwards.
- No settings, history, or usage data are stored. The app keeps no record of what you scanned, looked up, or printed.

## Changes the app can make to your Mac

These happen only when you ask for them:

- Adding, removing, pausing, or reconfiguring printers, and setting the default printer
- Saving the hosts file
- Changing a network service's IP address or DNS servers
- Turning Wi-Fi on or off

## Permissions

The app asks for each permission only when you use the feature that needs it. You can change any of them in System Settings > Privacy & Security.

| Permission | Used for | Notes |
| --- | --- | --- |
| Local Network | Printers, Device Scanner, Port Check, direct printing | Required by macOS for any contact with devices on your network. |
| Location Services | Showing Wi-Fi network names | macOS treats Wi-Fi names as location data. The app never reads your location. |
| Administrator password | Saving the hosts file, changing IP/DNS settings, and the optional hardware-address scan | Uses the standard macOS password dialog for each action. Your password goes to macOS and is never seen or stored by the app. Nothing is installed or left running in the background. |
| Folder access | Showing the sizes of Desktop, Documents, and Downloads | Requested by macOS. Only folder sizes are read. |

The app does not use your camera, microphone, contacts, calendars, photos, or your location.

## Children

Control Panel is a general system utility. It is not directed at children and collects no data from anyone.

## Open source

The full source code is public at https://github.com/dyckdavid/control-panel, so every statement in this policy can be checked independently.

## Changes to this policy

Any changes will be published on this page with a new effective date, and noted in the release notes of the version that introduces them.

## Contact

Questions about privacy: [dyckd27@gmail.com](mailto:dyckd27@gmail.com)
$cp_privacy$,
	updated_at = now()
WHERE slug = 'control-panel';

DELETE FROM portfolio.release_notes
WHERE app_id = (SELECT id FROM portfolio.apps WHERE slug = 'control-panel')
	AND version IN ('2.0.0');

INSERT INTO portfolio.release_notes (app_id, version, release_date, notes)
SELECT
	id,
	'2.0.0',
	'2026-10-14',
	$cp_notes$
Requires macOS 27 on Apple silicon.

### Printers, rebuilt

- Add printers by Bonjour discovery or IP address, as real macOS print queues
- Driverless IPP Everywhere, plus POS-58/POS-80 and label drivers for raw TCP printers
- Print files, text, or a test page, or print directly to an IP printer with no queue
- Thermal receipt printers: receipts, cut, feed, cash drawer, and status over ESC/POS

### Fixes

- Firewall status was always "Unknown" on current macOS
- Saving the hosts file and changing IP/DNS settings always failed; both now ask for an administrator password
- Wi-Fi now asks for Location access, which macOS requires to show network names

### Improvements

- Device Scanner finds far more devices, names them with Bonjour, and can show hardware addresses and manufacturers (administrator password)
- Live CPU and memory stats read directly from the kernel, with gauges
- Redesigned interface with sidebar search

Signed and notarized by Apple.
$cp_notes$
FROM portfolio.apps
WHERE slug = 'control-panel';

-- ---------------------------------------------------------------------------
-- OBS Apple Borders — download metadata for latest + release notes 1.4.0 / 1.3.0
-- Source: GitHub releases for dyckdavid/obs-apple-borders
-- ---------------------------------------------------------------------------

UPDATE portfolio.apps
SET
	download_url = COALESCE(
		NULLIF(download_url, ''),
		'https://github.com/dyckdavid/obs-apple-borders/releases/latest'
	),
	sha256 = COALESCE(
		NULLIF(sha256, ''),
		'a3a8b2d60b222f4822df04603627992455b1c1b13c4d1bbc5ef3d3a691e036dc'
	),
	version = COALESCE(NULLIF(version, ''), '1.4.0'),
	file_size = COALESCE(NULLIF(file_size, ''), '1.9 MB'),
	requirements = COALESCE(NULLIF(requirements, ''), 'OBS Studio; macOS, Windows, or Linux'),
	updated_at = now()
WHERE slug = 'obs-apple-borders';

DELETE FROM portfolio.release_notes
WHERE app_id = (SELECT id FROM portfolio.apps WHERE slug = 'obs-apple-borders')
	AND version IN ('1.4.0', '1.3.0');

INSERT INTO portfolio.release_notes (app_id, version, release_date, notes)
SELECT
	id,
	'1.4.0',
	'2026-10-14',
	$obs140$
### Checksums

```
obs-apple-borders-1.4.0-macos-universal.dmg: a3a8b2d60b222f4822df04603627992455b1c1b13c4d1bbc5ef3d3a691e036dc
obs-apple-borders-1.4.0-macos-universal.pkg: e8d14efac3c1d12bb968e523a7253bb3ba74e647ef50feb770cfcc6a13b4587f
obs-apple-borders-1.4.0-source.tar.xz: f9b57869127b34884d99bcd52571da013a4bae0fd32598c559b6b61beb7e981f
obs-apple-borders-1.4.0-windows-x64-Installer.exe: 9699e251f8a0a6b60206f98388ec4c25d5ce314d8465da37525440344a31ae3d
obs-apple-borders-1.4.0-windows-x64.zip: 0716e8aa4e843811ebf6d88686895466ca3315d7cc1a50afa9e387e6296cbc1d
obs-apple-borders-1.4.0-x86_64-linux-gnu-dbgsym.ddeb: 715e2784fe32e848cc8178ca3f5386916f31ba552e40a16f54b1c1fcfa834c5a
obs-apple-borders-1.4.0-x86_64-linux-gnu.deb: 49507e9eb4d4b9913dae0fd3a4d74be8ec8d28ba8caf8040222a0787fc86530a
obs-apple-borders-1.4.0-x86_64.pkg.tar.zst: 5259b9578ddd3e69e80e0b8c66095614e62ef3b147ff4d87ab5b84ea1051d1e6
```

Download: https://github.com/dyckdavid/obs-apple-borders/releases/tag/v1.4.0
$obs140$
FROM portfolio.apps
WHERE slug = 'obs-apple-borders';

INSERT INTO portfolio.release_notes (app_id, version, release_date, notes)
SELECT
	id,
	'1.3.0',
	'2026-10-14',
	$obs130$
### Checksums

```
obs-apple-borders-1.3.0-macos-universal.dmg: 791abfb694805186cc8ac01dcfbef803c8997c1adebeea94dbd49528423dfa4c
obs-apple-borders-1.3.0-macos-universal.pkg: bd13f9f88d89473da527b15e7d7296e32770224d7018bc14d604e703364ee4bb
obs-apple-borders-1.3.0-source.tar.xz: 24b6577abaa5542cdc38361e2abe3237f2eb0141b38771113e410a623f3434ba
obs-apple-borders-1.3.0-windows-x64-Installer.exe: 86840e277ad457303ca8fb6263baa142352d99d9e18a8eb368eec0622d8086d9
obs-apple-borders-1.3.0-windows-x64.zip: 2d66e55aeddfc73a1c2d2a664898d91ea688f7ced20c24a82d90db6760e6244a
obs-apple-borders-1.3.0-x86_64-linux-gnu-dbgsym.ddeb: 2a3eb98baa6b43ef42fa8384fb46f2467ea265353d5316978ddb36afec06c9ba
obs-apple-borders-1.3.0-x86_64-linux-gnu.deb: dc086b892b2ba1be956e322ca19bbe580b0d1babf0024b2875399925d4ad6f72
```

Download: https://github.com/dyckdavid/obs-apple-borders/releases/tag/v1.3.0
$obs130$
FROM portfolio.apps
WHERE slug = 'obs-apple-borders';
