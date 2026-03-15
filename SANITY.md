# Charleston Pride - Sanity CMS

Documentation for the Sanity CMS schema and how it's used across applications.

## Schema Location

Sanity schema definitions live in `/web/schema/` — co-located with the Studio that owns them:

```
web/
└── schema/
    ├── documents/        # Document types (page, person, sponsor, etc.)
    │   └── singletons/   # Singleton documents (home, footer, navigation, ourTeam)
    ├── objects/          # Reusable objects (buttons, cards, etc.)
    ├── fields/           # Field definitions
    └── index.ts          # Exports all schema types
```

## Sanity Studio

The Studio is integrated into the `/web` Next.js app and is the only place schemas are registered with Sanity:

- **Development:** http://localhost:3000/studio
- **Standalone:** `cd web && npm run studio`
- **Production:** https://charlestonpride.org/studio

Studio-specific config (structure, plugins, tools) lives exclusively in `/web`:

```
web/
├── sanity.config.ts      # Studio config — imports schemas from ./schema
├── sanity.cli.ts         # Sanity CLI config (includes typegen config)
├── schema/               # Sanity schema definitions
├── plugins/              # Sanity Studio plugins
├── tools/                # Custom Studio tools
└── sanity/lib/           # Web-specific Sanity utilities
    ├── client.ts         # Sanity client
    ├── env.ts            # Project config (projectId, dataset, apiVersion)
    ├── image.ts          # Image URL builder
    ├── queries.ts        # GROQ queries (web-specific)
    └── sanity.types.ts   # Generated TypeScript types (git-ignored)
```

## App-Specific Configuration

Each app maintains its own Sanity client configuration and GROQ queries under `<app>/sanity/lib/`. The `/community` app consumes Sanity data via GROQ queries and does not import schema definitions directly.

| App         | Client config         | GROQ queries                        | Schema         |
|-------------|----------------------|-------------------------------------|----------------|
| `/web`      | `web/sanity/lib/`    | `web/sanity/lib/queries.ts`         | `web/schema/`  |
| `/community`| *(future)*           | *(future)*                          | N/A            |

## Generating Types

From the `/web` directory:

```bash
npm run typegen
```

This runs `sanity schema extract` (writes `web/schema.json`) then `sanity typegen generate` (writes `web/sanity/lib/sanity.types.ts`). Both files are git-ignored.

## Environment Variables

`/web` needs these Sanity credentials in `.env`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
```

For Studio write operations:

```
SANITY_API_TOKEN=
```
