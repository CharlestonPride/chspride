# AGENTS.md — Charleston Pride Digital Ecosystem

Architecture and operational guide for AI agents and contributors. For setup, scripts, and folder
trees, see [README.md](README.md) and [web/README.md](web/README.md) — this file covers the
non-obvious *how it fits together* and *why*, which those don't.

## The one constraint that drives every decision: cost

This is a volunteer project on a fixed **~$2,000/year Azure grant** (≈ $166/mo). Everything is
architected to stay on **free tiers**:

- All three sites are **static exports** on **Azure Static Web Apps free tier** ($0).
- Builds run in **GitHub Actions** (free for public repos).
- The backend is **Azure Functions** on the consumption plan (1M free executions/mo).

**Do not introduce SSR or ISR.** A running Node server (App Service B1 ≈ $156/yr for one app) would
consume a large slice of the grant. Any "freshness" or "dynamic" need must be solved with static
builds + client-side progressive enhancement, not server rendering.

## Repository layout (monorepo, not an npm workspace)

Each app manages its own dependencies; there is no shared root `node_modules`.

| Path | What it is | Rendering | Deploy target (SWA) |
|---|---|---|---|
| `web/` | Main charlestonpride.org site **+ Sanity Studio** (`/studio`) | Static export | `kind-ground` (prod) |
| `community/` | "United in Pride" standalone app | Static export | `polite-desert` |
| `functions/` | Azure Functions backend (build trigger, forms, submissions) | Serverless | `azure-functions-deploy.yml` |
| `mobile/` | Capacitor wrapper over the production website | — | App stores |

`web/` also has a **second SWA deployment, `nice-glacier`** — a *preview* build of the same code with
`NEXT_PUBLIC_PREVIEW_MODE=true` (see Preview mode below).

## Content model: one Sanity instance, two consumers

There is a **single Sanity project** (`jgra26o6`, dataset `production`). The schema is defined **only
in [web/schema/](web/schema/)** — `community/` has no schema directory and reads the same content.

Each app has its **own** Sanity client + GROQ queries:
- [web/sanity/lib/queries.ts](web/sanity/lib/queries.ts)
- [community/sanity/lib/queries.ts](community/sanity/lib/queries.ts)

**Visibility gates** control which app shows a document, set on the event schema:
- `showOnCP` → render on the Charleston Pride web app.
- `showOnUIP` → render on the United in Pride community app.

After editing anything in `web/schema/`, run `npm run typegen` (in `web/`) to regenerate
`sanity/lib/sanity.types.ts`.

## Events & the static-export freshness gap (important)

Past events are filtered out **at build time** in GROQ, e.g. in
[web/sanity/lib/queries.ts](web/sanity/lib/queries.ts):

```groq
*[_type == "event" && showOnCP == true && (
  (defined(endDateTime) && endDateTime >= now()) ||
  (!defined(endDateTime) && startDateTime >= now())
)]
```

Because the site is statically exported, `now()` is evaluated **only when the site builds**. A past
event therefore keeps showing until the **next build** — this is the central UX trade-off of staying
static. Mitigations (no SSR): rebuild on a schedule, and/or hide past events client-side as
progressive enhancement (render in HTML for SEO, filter against real `now()` on the client).

### Server vs client rendering — know which is which
- `/events` list pages (web & community) are **server components / SSG** — they reflect build-time
  data and go stale between builds.
- The homepage [web/components/card/UpcomingEventsCard.tsx](web/components/card/UpcomingEventsCard.tsx)
  is **`use client`** and fetches live — so it's always fresh but its events are **not in the static
  HTML** (an SEO trade-off). Be deliberate about which pattern a new component needs.
- **Gotcha:** `community/app/events/page.tsx` passes `next: { revalidate: 60 }`, but community is
  `output: "export"`, so **`revalidate` is inert** — it does nothing. Don't rely on it for freshness.

## Build & deploy pipeline

Production is **not** rebuilt on `git push` alone for content changes — content lives in Sanity, not
git. The trigger chain is:

```
Editor publishes in Sanity
  → Sanity GROQ webhook (configured in the manage.sanity.io DASHBOARD, not in this repo)
  → Azure Function `build-static`  (functions/src/functions/buildStatic.mjs)
  → GitHub workflow_dispatch on main
  → azure-static-web-apps-kind-ground-*.yml builds & deploys (~5 min)
```

- There is **also a manual "Deploy" tool inside Sanity Studio**
  ([web/tools/deploy.tsx](web/tools/deploy.tsx)) that hits the same `build-static` endpoint — the
  editor's explicit "push it live" button.
- **`web/scripts/manage-webhook.mjs` does NOT work** for managing the webhook — its token lacks the
  required scope / the plan doesn't expose webhook management via API. Manage the webhook in the
  **Sanity dashboard UI** instead.
- **Known pain point:** the per-publish webhook means each publish kicks off a build; rapid edits
  create overlapping builds that cancel each other. The intended direction is to disable the
  per-publish webhook and rely on **scheduled builds + the manual Deploy button** (keeps everything
  static and cheap). See `PLAN.md` / planning notes if present.

## Preview mode (`NEXT_PUBLIC_PREVIEW_MODE`)

The `nice-glacier` deployment builds `web/` with `NEXT_PUBLIC_PREVIEW_MODE=true` and a Sanity read
token. In preview mode, server pages swap to **client-side draft-fetching** components — e.g.
[web/app/(pages)/events/page.tsx](web/app/(pages)/events/page.tsx) renders
[web/components/preview/EventsPreview.tsx](web/components/preview/EventsPreview.tsx), which fetches
via `previewClient` in a `useEffect`.

This client-fetch substrate is **how draft preview works without SSR**, and is the basis for wiring
Sanity's Presentation tool to the preview site (Presentation is **not** currently configured in
[web/sanity.config.ts](web/sanity.config.ts)).

## Azure Functions backend (`functions/`)

Serverless endpoints (consumption plan), deployed via `azure-functions-deploy.yml`:

| Function | Purpose |
|---|---|
| `buildStatic` | Receives the deploy webhook → triggers the prod GitHub workflow |
| `contactForm` | Handles website contact form submissions |
| `submitEvent` | Community event submissions (writes back to Sanity) |
| `submitResource` | Community resource submissions |

## Conventions & gotchas

- **Builds use `--webpack`** (not Turbopack) to avoid Sass issues; see [web/README.md](web/README.md).
- **Images are `unoptimized`** in both apps — required for static export.
- Web app styling is **Bootstrap 5**; community app is **Tailwind**. They share content, not components.
- Path aliases in `web/`: `@/*` → `web/*`, `@sanity/*` → `web/sanity/*`.
- When adding event-related fields, update the schema in `web/schema/`, regenerate types, and update
  **both** `web/` and `community/` queries if both apps should surface the field.
