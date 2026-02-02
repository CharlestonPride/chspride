# Charleston Pride - Sanity Schema

This directory contains the shared Sanity CMS schema, configuration, and utilities used by both the web and mobile applications.

## Structure

```
├── env.ts              # Environment configuration
├── queries.tsx         # GROQ queries
├── lib/                # Client utilities and types
│   ├── client.ts       # Sanity client configuration
│   ├── image.ts        # Image URL builder
│   ├── sanity.types.ts # Generated TypeScript types
│   ├── types.ext.ts    # Extended type definitions
│   └── utils.ts        # Utility functions
├── schema/             # Sanity schema definitions
│   ├── index.ts
│   ├── constants/
│   ├── documents/      # Document schemas
│   ├── fields/         # Reusable field definitions
│   ├── navigation/     # Navigation schemas
│   ├── objects/        # Object schemas
│   └── singletons/     # Singleton document schemas
├── plugins/            # Sanity plugins
│   └── settings.tsx
└── tools/              # Custom Sanity Studio tools
    ├── deploy.tsx
    └── guide.tsx
```

## Usage in Web Application

The web application imports from this directory using the `@sanity/*` path alias configured in `tsconfig.json`:

```typescript
import { client } from "@sanity/lib/client";
import { urlFor } from "@sanity/lib/image";
import type { Page } from "@sanity/lib/sanity.types";
```

## Usage in Mobile Application

The mobile application will connect to the same Sanity instance using the credentials configured in its environment variables.

You may need to create platform-specific queries optimized for mobile views, but the schema remains the same.

## Generating Types

TypeScript types are generated from the schema and should be regenerated whenever the schema changes:

```bash
cd ../web
npm run typegen
```

This command extracts the schema and generates TypeScript types in `lib/sanity.types.ts`.

## Environment Variables

Both applications need these Sanity credentials:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Dataset name (e.g., 'production')
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version (e.g., '2024-01-01')

For write operations (Studio):

- `SANITY_API_TOKEN` - API token with write permissions
