# Charleston Pride

This repository contains the Charleston Pride web application and mobile application (coming soon), with shared Sanity CMS schema.

## Repository Structure

```
├── web/                 # Next.js web application (independent)
├── mobile/              # Flutter mobile application (independent)
├── sanity-schema/       # Shared Sanity CMS schema (types, queries, schemas only)
└── .github/workflows/   # CI/CD workflows
```

**Note:** This is not an npm workspace. Each application manages its own dependencies independently.

## Projects

### Web Application (`/web`)

A Next.js application for the Charleston Pride website, using Sanity CMS for content management.

See [web/README.md](web/README.md) for detailed documentation.

**Quick Start:**

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the web app.

The Sanity Studio is available at [http://localhost:3000/studio](http://localhost:3000/studio).

### Mobile Application (`/mobile`)

A Flutter mobile application for Charleston Pride (coming soon).

**Setup:**

To initialize the Flutter project:

```bash
cd mobile
flutter create --org com.charlestonpride --project-name chspride_mobile .
```

See [mobile/README.md](mobile/README.md) for more details.

### Shared Sanity Schema (`/sanity-schema`)

Contains only truly shared Sanity CMS content:

- Schema definitions (`schema/`)
- Type files (`lib/sanity.types.ts`, `lib/types.ext.ts`)

**Note:** Client configuration, image utilities, queries, and environment variables are maintained separately in each application (`web/sanity/lib/`, future `mobile/lib/`). This allows each app to configure Sanity independently and define app-specific queries while sharing schema definitions.

The web application stores Sanity credentials in `web/sanity/lib/env.ts` (not using environment variables to avoid build-time configuration issues with static exports). The mobile application will maintain its own configuration.

## Deployment

The web application is automatically deployed to Azure Static Web Apps via GitHub Actions on pushes to the `main` branch.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Flutter Documentation](https://docs.flutter.dev)
- [Sanity Documentation](https://www.sanity.io/docs)
