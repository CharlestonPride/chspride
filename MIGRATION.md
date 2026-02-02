# Repository Restructuring - Migration Guide

## What Changed

This repository has been restructured to support both web and mobile applications while sharing Sanity CMS schema definitions.

### New Structure

```
chspride/
├── web/                    # Next.js web application (manages own dependencies)
│   ├── sanity/lib/        # Web-specific Sanity client & utilities
│   └── package.json       # Web dependencies
├── mobile/                 # Flutter mobile application (independent)
├── sanity-schema/          # Shared schema only (no dependencies)
│   ├── schema/            # Sanity schema definitions
│   ├── lib/               # Type definitions
│   └── queries.tsx        # GROQ queries
├── package.json           # Root scripts only (no workspaces)
└── README.md              # Updated documentation
```

**Key Changes:**

- **Not an npm workspace** - Each app manages dependencies independently
- **Sanity client moved** - From `sanity-schema/lib/client.ts` to `web/sanity/lib/client.ts`
- **Environment config moved** - From `sanity-schema/env.ts` to `web/sanity/lib/env.ts`
- **Image utilities moved** - From `sanity-schema/lib/` to `web/sanity/lib/`
- **sanity-schema simplified** - Only contains schemas, types, and queries (no dependencies)

## Next Steps

### For Web Development

1. Navigate to the web directory:

   ```bash
   cd web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The web application should work exactly as before. Imports are structured as:

- `@/sanity/lib/client` - Local web client
- `@/sanity/lib/image` - Local image utilities
- `@sanity/lib/sanity.types` - Shared types from sanity-schema
- `@sanity/queries` - Shared queries from sanity-schema

### For Mobile Development

1. Navigate to the mobile directory:

   ```bash
   cd mobile
   ```

2. Initialize the Flutter project:

   ```bashSanity client in your Flutter app (independent from web)

   ```

3. The mobile app can reference shared schema types from
   - Copy `.env.example` (create one) with your Sanity credentials
   - Configure Sanity client in your Flutter app

4. The mobile app will reference the same Sanity schema in `../sanity-schema/`

### Helper Commands (from root)

The root `package.json` provides convenient scripts:

```bash
npm run web:dev          # Start web dev server
npm run web:build        # Build web for production
npm run web:studio       # Run Sanity Studio
npm run web:install      # Install web dependencies
npm run mobile:flutter   # Run Flutter app
```

## CI/CD Changes

The GitHub Actions workflow has been updated:

- `app_location` changed from `/` to `/web`
- The workflow now builds from the `web/` directory
- Existing Azure Static Web Apps deployment configuration remains the same

## Important Notes

1. **Path Aliases**: The web app now uses `@sanity/*` to import from the shared schema directory instead of relative `./sanity/` imports.

2. \*\*TypeScript Confi
   - `@/sanity/*` - Maps to `web/sanity/*` (local web code)
   - `@sanity/*` - Maps to `../sanity-schema/*` (shared schema)

3. **TypeScript Config**: The `web/tsconfig.json` has path mappings:

   ```json
   {
     "@/*": ["./*"],
     "@sanity/*": ["../sanity-schema/*"]
   }
   ```

4. **No Workspace Configuration**: Each app runs `npm install` independently. There is no shared node_modules or workspace dependencies.

5. **Sanity Configuration**: Each app maintains its own Sanity client and configuration:
   - Web: `web/sanity/lib/client.ts` and `web/sanity/lib/env.ts`
   - Mobile: Will have its own configurationst:3000/studio` when running the web dev server.

6. **Type Generation**: Run `npm run typegen` from the `web/` directory to regenerate Sanity TypeScript types.

## Verification Checklist

- [ ] Web app builds successfully (`cd web && npm run build`)
- [ ] Web dev server runs without errors (`cd web && npm run dev`)
- [ ] Sanity Studio is accessible at `/studio`
- [ ] GitHub Actions workflow runs successfully
- [ ] All Sanity imports resolve correctly

## Rollback

If you need to rollback, the previous structure is preserved in git history before this branch.

## Questions?

See the README files in each directory for more specific documentation:

- [Root README](../README.md)
- [Web README](../web/README.md) - Coming soon
- [Mobile README](../mobile/README.md)
- [Sanity Schema README](../sanity-schema/README.md)
