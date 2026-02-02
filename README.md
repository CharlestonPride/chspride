# Charleston Pride - Monorepo

This repository contains the Charleston Pride web and mobile applications, along with shared Sanity CMS schema.

## Repository Structure

```
├── web/                 # Next.js web application
├── mobile/              # Flutter mobile application
├── sanity-schema/       # Shared Sanity CMS schema and configuration
└── .github/workflows/   # CI/CD workflows
```

## Projects

### Web Application (`/web`)

A Next.js application for the Charleston Pride website, using Sanity CMS for content management.

**Getting Started:**

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the web app.

The Sanity Studio is available at [http://localhost:3000/studio](http://localhost:3000/studio).

**Available Scripts:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run studio` - Run Sanity Studio standalone
- `npm run typegen` - Generate TypeScript types from Sanity schema

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

Contains the Sanity CMS schema, plugins, queries, and configuration shared between web and mobile applications.

Both applications connect to the same Sanity instance but may use different GROQ queries optimized for their respective platforms.

## Environment Variables

Both web and mobile applications require Sanity credentials. Create a `.env` file in each project directory:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=your_dataset
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

## Deployment

The web application is automatically deployed to Azure Static Web Apps via GitHub Actions on pushes to the `main` branch.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Flutter Documentation](https://docs.flutter.dev)
- [Sanity Documentation](https://www.sanity.io/docs)
