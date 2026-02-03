# Charleston Pride - Sanity CMS Schema

Documentation for the Sanity CMS schema and how it's used across web and mobile applications.

## Purpose

- **Web Application**: Manages the full Sanity Studio, schema definitions, plugins, and tools in `/web/schema/`, `/web/plugins/`, and `/web/tools/`
- **Mobile Application**: Will generate Dart classes from exported `schema.json` for type-safe Sanity data access

## Schema Location

All Sanity schema definitions, Studio configuration, plugins, and tools are located in `/web`:

```
web/
├── schema/             # Schema definitions
│   ├── documents/      # Document types (page, person, sponsor, etc.)
│   ├── objects/        # Reusable objects (buttons, cards, etc.)
│   ├── fields/         # Field definitions
│   └── index.ts        # Exports all schema types
├── plugins/            # Sanity Studio plugins
│   └── setttings.tsx   # Singleton plugin
├── tools/              # Custom Studio tools
│   ├── deploy.tsx      # Deployment tool
│   └── guide.tsx       # Guide tool
├── sanity/lib/         # Web-specific Sanity configuration
│   ├── client.ts       # Sanity client
│   ├── env.ts          # Project configuration
│   ├── image.ts        # Image utilities
│   ├── queries.ts      # GROQ queries
│   └── sanity.types.ts # Generated types (git-ignored)
└── schema.json         # Exported schema (git-ignored)
```

## Generating schema.json

From the `/web` directory:

```bash
npm run typegen
```

This command:

1. Extracts the schema to `web/schema.json`
2. Generates TypeScript types to `web/sanity/lib/sanity.types.ts`

The Flutter app can use `web/schema.json` to generate Dart classes.

## Web Application - Sanity Studio

The Sanity Studio is integrated into the Next.js web application:

- **Development**: http://localhost:3000/studio
- **Production**: https://yourdomain.com/studio

To run Studio standalone:

```bash
cd web
npm run studio
```

## Mobile Application Usage

The Flutter app will:

1. Use a Sanity Dart package to connect to the CMS
2. Generate Dart classes from `web/schema.json` for type safety
3. Define its own GROQ queries optimized for mobile views
4. Configure Sanity credentials independently

All schema definitions, plugins, and Studio tools are maintained in `/web` since only the web app runs Sanity Studio.

This command extracts the schema and generates TypeScript types in `lib/sanity.types.ts`.

## Environment Variables

Both applications need these Sanity credentials:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Dataset name (e.g., 'production')
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version (e.g., '2024-01-01')

For write operations (Studio):

- `SANITY_API_TOKEN` - API token with write permissions
