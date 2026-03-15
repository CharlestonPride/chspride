# Charleston Pride - Mobile App

A Capacitor PWA wrapper around the Charleston Pride production website, packaged for iOS and Android.

## How It Works

This app uses Capacitor's `server.url` setting to load `https://charlestonpride.org` directly — it does not bundle a local web build. This keeps the mobile app always in sync with the live website without any additional build steps.

## Setup

```bash
cd mobile
npm install
```

## Adding Native Platforms

```bash
npm run add:ios       # Add iOS platform
npm run add:android   # Add Android platform
```

## Syncing

After adding platforms or updating `capacitor.config.json`:

```bash
npm run sync
```

## Opening in Native IDEs

```bash
npm run open:ios      # Open in Xcode
npm run open:android  # Open in Android Studio
```

## Configuration

See `capacitor.config.json` for app ID, name, and plugin settings.

- **App ID:** `org.charlestonpride.app`
- **App Name:** Charleston Pride
- **Source:** `https://charlestonpride.org` (live website)
