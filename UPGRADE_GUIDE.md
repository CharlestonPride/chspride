# Dependency Upgrade Guide

**Branch:** `handle-outdated-deps`  
**Date:** February 2, 2026  
**Current Node Version:** 20.14.0

## Overview

The project currently has 20 security vulnerabilities that cannot be fixed without breaking changes. All vulnerabilities stem from being on Node 20.14.0 while latest packages require Node 20.19+.

## Current Vulnerabilities

### Critical (1)

- **Next.js 15.1.0** - Multiple vulnerabilities including:
  - RCE in React flight protocol
  - DoS with Server Actions
  - Authorization bypass in middleware
  - SSRF, cache poisoning, and more
  - **Fix:** Upgrade to Next.js 15.5.11+

### High (10)

- **Sanity 3.52.4** → Requires Sanity 5.7.0+
  - glob: Command injection vulnerability
  - prismjs: DOM clobbering vulnerability
  - Affects: @sanity/cli, @sanity/runtime-cli, @sanity/ui, @sanity/vision
- **next-sanity 9.8.27** → Requires next-sanity 12.0+
  - valibot: ReDoS vulnerability in EMOJI_REGEX

### Moderate (9)

- Various transitive dependencies from Sanity packages

## Upgrade Path

### Step 1: Upgrade Node.js

**Recommended:** Node.js 22 LTS (latest stable)  
**Minimum:** Node.js 20.19.0

```bash
# Download and install from nodejs.org
# Or use nvm:
nvm install 22
nvm use 22
```

Verify installation:

```bash
node --version  # Should show v22.x.x or v20.19+
npm --version   # Should show latest npm
```

### Step 2: Update package.json

Update the following dependencies:

```json
{
  "engines": {
    "node": ">=20.19.0"
  },
  "dependencies": {
    "@portabletext/react": "^6.0.2",
    "@sanity/client": "^6.15.7",
    "@sanity/image-url": "^2.0.3",
    "@sanity/vision": "^5.7.0",
    "groq": "^5.7.0",
    "next": "^15.5.11",
    "next-sanity": "^12.0.16",
    "sanity": "^5.7.0",
    "sanity-plugin-media": "^4.1.1"
  }
}
```

### Step 3: Clean Install

```bash
cd web
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Step 4: Update Sanity Configuration

#### React 19 Requirement

Sanity 5 requires React 19. Update:

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
```

#### TypeScript Configuration

Update `tsconfig.json` to use React 19:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["react/next", "react-dom/next"]
  }
}
```

### Step 5: Test Critical Paths

After upgrading, test these areas:

#### Sanity Client

- [ ] Test fetching data from Sanity
- [ ] Verify GROQ queries work
- [ ] Check image URL generation

#### Sanity Studio

- [ ] Access studio at `/studio`
- [ ] Create/edit content
- [ ] Upload images
- [ ] Publish changes

#### Next.js Features

- [ ] Static generation works
- [ ] Dynamic routes render
- [ ] Build completes successfully
- [ ] Production export works

#### Type Generation

```bash
npm run typegen
```

Verify types are generated without errors.

## Breaking Changes to Watch For

### React 19 Changes

- **Removed:** `React.FC` type (use function components directly)
- **Changed:** Ref handling (use `forwardRef` differently)
- **New:** React Compiler support (optional)

**Migration:**

```typescript
// Before (React 18)
const Component: React.FC<Props> = ({ children }) => { ... }

// After (React 19)
const Component = ({ children }: Props) => { ... }
```

### Next.js 15.5+ Changes

- **Image component:** New optimization defaults
- **Middleware:** Enhanced security checks
- **Server Actions:** Improved error handling
- **TypeScript:** Stricter type checking

### Sanity 5 Changes

- **Studio UI:** New @sanity/ui v3+
- **Schema:** Improved type inference
- **Plugins:** API changes for custom plugins
- **Vision:** Updated query interface

**Check these files:**

- `web/sanity.config.ts` - May need plugin updates
- Custom schemas in `sanity-schema/schema/` - Verify types
- Any custom Sanity plugins

### next-sanity 12+ Changes

- **Visual Editing:** New integration API
- **Preview Mode:** Deprecated in favor of Draft Mode
- **Client:** Now requires @sanity/client v6+

**Migration steps:**

1. Update `client.ts` if using preview features
2. Switch from Preview Mode to Draft Mode if applicable
3. Update any custom preview components

## Rollback Plan

If issues arise after upgrade:

### Option 1: Quick Rollback

```bash
git checkout web/package.json web/package-lock.json
npm install
```

### Option 2: Stay on Current Versions

Document accepted vulnerabilities and their risks:

- Deploy behind a firewall/VPN
- Implement rate limiting
- Add input validation
- Monitor for suspicious activity

### Option 3: Partial Upgrade

Upgrade only Next.js (less risky):

```json
{
  "dependencies": {
    "next": "^15.5.11"
  }
}
```

This fixes the critical RCE vulnerability while keeping Sanity on v3.

## Testing Checklist

### Development Server

- [ ] `npm run dev` starts without errors
- [ ] No TypeScript errors
- [ ] Hot reload works
- [ ] Studio accessible

### Build Process

- [ ] `npm run build` completes
- [ ] No build errors or warnings
- [ ] Static export successful
- [ ] All routes generated

### Content Management

- [ ] Can create new content in Studio
- [ ] Can edit existing content
- [ ] Images upload and display
- [ ] Content publishes correctly

### Frontend Display

- [ ] Homepage loads
- [ ] Dynamic pages work
- [ ] Images render correctly
- [ ] Navigation functional
- [ ] Styles load properly

### Type Safety

- [ ] No TypeScript errors
- [ ] IntelliSense works
- [ ] Types match Sanity schema

## Post-Upgrade Tasks

1. **Update Documentation**
   - Update `web/README.md` with new Node requirement
   - Update root `README.md` if needed

2. **Update CI/CD**
   - Update GitHub Actions Node version
   - Update Azure Static Web Apps Node version

3. **Verify Sass Warnings**
   - Check if deprecation warnings are reduced/fixed
   - Update custom SCSS if needed

4. **Run Security Audit**

   ```bash
   npm audit
   ```

   Should show 0 vulnerabilities.

5. **Monitor Production**
   - Check error logs after deployment
   - Monitor performance metrics
   - Verify content updates work

## Additional Resources

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Sanity v5 Migration Guide](https://www.sanity.io/docs/migrating-to-v5)
- [next-sanity Changelog](https://github.com/sanity-io/next-sanity/releases)

## Support

If you encounter issues during upgrade:

- Check GitHub issues for similar problems
- Review migration guides linked above
- Test each change incrementally
- Keep the old package-lock.json for quick rollback

## Timeline Estimate

- **Node Upgrade:** 15 minutes
- **Package Updates:** 30 minutes
- **Code Changes:** 1-2 hours
- **Testing:** 2-3 hours
- **Documentation:** 30 minutes

**Total:** ~4-6 hours for safe upgrade with thorough testing
