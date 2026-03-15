# Repository Migration Guide

Documents the evolution of the repository structure.

---

## v4 — Schema Moved Back to `/web` (current)

Reverted the shared schema approach from v3. Sanity schema definitions are now co-located with the Studio in `/web/schema/` rather than a top-level `/shared` folder.

### What Changed

- **`/shared/schema/` moved back to `/web/schema/`** — schemas belong to the Studio, not shared infrastructure
- **`@shared/*` path alias removed** — from both `/web` and `/community` `tsconfig.json`
- **`/web/sanity.config.ts` updated** — imports schemas via `./schema/...` instead of `../shared/schema/...`
- **`/shared/` folder deleted** — no longer needed

### Why

The `/community` app consumes Sanity *data* via GROQ queries, not Sanity *schema definitions*. Schemas are Studio configuration and require the `sanity` package to be installed. Placing them in a folder with no `package.json` caused unresolvable import errors. Since only `/web` needs schemas, they belong in `/web`.

### Structure

```
chspride/
├── web/                  # Next.js website + Sanity Studio
│   ├── schema/           # Sanity schema definitions
│   ├── sanity/lib/       # Sanity client, queries, generated types
│   ├── plugins/          # Sanity Studio plugins
│   ├── tools/            # Custom Sanity Studio tools
│   └── package.json
├── community/            # "United in Pride" Next.js + Capacitor app
│   └── package.json
├── mobile/               # Charleston Pride Capacitor wrapper over /web
│   └── package.json
└── package.json          # Root helper scripts only
```

---

## v3 — Capacitor + Shared Schema

Replaced the planned Flutter mobile app with two Capacitor-based PWAs, and moved Sanity schema out of `/web` into a top-level `/shared` folder (later reverted in v4).

### What Changed

- **`/web/schema/` moved to `/shared/schema/`** — intended to share schemas between `/web` and `/community`
- **`@shared/*` path alias added** — both `/web` and `/community` `tsconfig.json` files mapped `@shared/*` to `../shared/*`
- **`/community` scaffolded** — new Next.js 16 + TypeScript + Tailwind v4 + Capacitor 7 app ("United in Pride")
- **Root `package.json` updated** — added `community:*` and `mobile:sync` scripts, removed Flutter script

---

## v2 — Web + Sanity Schema Restructure

Separated shared Sanity schema into a dedicated folder. Sanity client and utilities moved to be web-specific.

**Key changes:**
- Sanity client moved from `sanity-schema/lib/client.ts` → `web/sanity/lib/client.ts`
- Environment config moved from `sanity-schema/env.ts` → `web/sanity/lib/env.ts`
- Schema definitions previously in `sanity-schema/schema/` moved to `web/schema/`
- CI/CD `app_location` updated from `/` to `/web`

---

## v1 — Initial Single-App Structure

The repository started as a single Next.js app at the root with all Sanity configuration inline.

---

## Verification Checklist (v4)

- [ ] `cd web && npm run build` succeeds
- [ ] `cd web && npm run dev` runs without errors
- [ ] Sanity Studio accessible at `/studio`
- [ ] Schema imports resolve correctly in `/web`
- [ ] `/community` scaffolding in place
- [ ] GitHub Actions workflow passes
