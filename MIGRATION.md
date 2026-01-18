# Monorepo Restructuring - Migration Guide

## What Changed

This repository has been restructured from a single Next.js application to a monorepo that supports both web and mobile applications sharing a common Sanity CMS schema.

### New Structure

```
chspride/
├── web/                    # Next.js web application (formerly at root)
├── mobile/                 # Flutter mobile application (new)
├── sanity-schema/          # Shared Sanity schema (formerly /sanity)
├── .github/workflows/      # Updated CI/CD workflows
├── package.json           # Root monorepo package.json with helper scripts
└── README.md              # Updated documentation
```

### Removed

- `Dockerfile` and `.dockerignore` - No longer needed
- Root-level build artifacts (`.next`, `build`, `node_modules`, `out`)

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

The web application should work exactly as before. All imports have been updated to use the new `@sanity/*` path alias that points to `../sanity-schema/`.

### For Mobile Development

1. Navigate to the mobile directory:

   ```bash
   cd mobile
   ```

2. Initialize the Flutter project:

   ```bash
   flutter create --org com.charlestonpride --project-name chspride_mobile .
   ```

3. Set up environment variables:
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

2. **TypeScript Config**: The `web/tsconfig.json` has been updated with a new path mapping:

   ```json
   "@sanity/*": ["../sanity-schema/*"]
   ```

3. **Environment Variables**: Make sure `.env` files are in the correct locations:
   - Web: `web/.env` and `web/.env.local`
   - Mobile: `mobile/.env` (after Flutter initialization)

4. **Sanity Studio**: Still accessible at `http://localhost:3000/studio` when running the web dev server.

5. **Type Generation**: Run `npm run typegen` from the `web/` directory to regenerate Sanity TypeScript types.

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
