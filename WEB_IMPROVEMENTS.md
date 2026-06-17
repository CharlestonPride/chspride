# Web Improvements — Handoff

Exploration of three pain points in the `/web` (and related `/community`) stack, with chosen
directions. Architecture background lives in [AGENTS.md](AGENTS.md); this doc is the *decisions and
next steps* to pick up later. Nothing here is implemented yet.

## Problems (priority order — end-user experience first)

1. **End user** — past events linger. `endDateTime` filtering runs in GROQ at **build time**, but the
   site is a static export, so a finished event keeps showing until the next build.
2. **Maintainer** — the non-technical editor publishes one change at a time, and **every publish fires
   a production build** via a Sanity dashboard webhook. Rapid edits create overlapping builds that
   cancel each other. They won't run locally and don't use the preview site today.
3. **Cost** — ~$2,000/year Azure grant. **SSR/ISR is off the table** (a running Node server would eat
   the grant). Must stay static.

## Key facts that shaped the plan (verified in code)

- The manual **Deploy button already exists** in Sanity Studio
  ([web/tools/deploy.tsx](web/tools/deploy.tsx)) and hits the same `build-static` Azure Function as the
  auto-webhook — so the build storm is a *duplicate* of an already-built manual path.
- The build trigger is a **GROQ webhook configured in the manage.sanity.io dashboard** (not in repo).
  `web/scripts/manage-webhook.mjs` **cannot** manage it (token scope) — disable it in the dashboard UI.
- The homepage events widget is **already `use client`** and fetches live
  ([web/components/card/UpcomingEventsCard.tsx](web/components/card/UpcomingEventsCard.tsx)); the
  `/events` list page is **SSG** and is what goes stale.
- Preview mode already renders drafts **client-side** (no SSR) via
  [web/components/preview/EventsPreview.tsx](web/components/preview/EventsPreview.tsx) — the basis for
  wiring Sanity Presentation to the preview site.
- Cost reality: SWA free tier, GitHub Actions, and the consumption-plan Function are all ~$0. Builds
  are essentially free — so **we can rebuild frequently and cheaply**.

## Chosen directions

### 1. Build triggers (maintainer)
- **Disable the per-publish GROQ webhook** in the Sanity dashboard (one-time manual toggle).
- **Keep the Deploy button** as the editor's explicit "push it live" action.
- **Add a scheduled cron build** to `azure-static-web-apps-kind-ground-*.yml`, plus
  `concurrency: { group: prod-deploy, cancel-in-progress: true }` so any overlap cancels cleanly.
- New editor flow: *edit → review in Studio (see below) → publish freely → click Deploy when done*
  (scheduled build is the safety net).

### 2. Event freshness (end user)
- **Rely on scheduled rebuilds** (no client-side hiding) to keep it simple and SEO-safe.
- **Trade-off to settle:** nightly leaves a finished event up for much of a day. Since builds are
  ~free, run the cron **every ~2 hours** (or hourly) to bound staleness. **Decide the acceptable
  staleness window — it sets the cron cadence.**
- **Fallback if that's too loose:** client-side hide as progressive enhancement — render events into
  HTML (SEO preserved), filter against real `now()` on the client. Not chosen, but documented.

### 3. Preview site → Sanity Presentation (maintainer review)
- Keep the `nice-glacier` preview deployment; make it the editor's live-review environment.
- Add `presentationTool({ previewUrl: <nice-glacier URL> })` to
  [web/sanity.config.ts](web/sanity.config.ts) (not configured today).
- Works **without SSR** because the preview build already fetches drafts client-side. For click-to-edit
  overlays, enable **stega + the `drafts` perspective** on `previewClient`.

## Open questions to resolve before implementing
1. Acceptable past-event **staleness window** → cron cadence (hourly / 2h / nightly).
2. Repo **public?** (confirms free GitHub Actions minutes at higher cron frequency).
3. **Presentation feasibility** — confirm the preview read token is drafts-scoped and overlays work
   against client-fetched pages.
4. **Fallback appetite** — pre-approve the client-side hide enhancement if scheduled-only disappoints?
5. **Community** — its `revalidate: 60` is **inert** under static export; remove it and apply the same
   scheduled-rebuild + concurrency pattern if it needs its own trigger.

## Implementation sketch (when ready)
- **Sanity dashboard (manual):** disable the per-publish webhook.
- `azure-static-web-apps-kind-ground-*.yml`: add `on.schedule` cron + `concurrency` block.
- [web/sanity.config.ts](web/sanity.config.ts): add `presentationTool`; enable stega/drafts on
  `previewClient`.
- (Deferred) progressive client-side `now()` filter on event lists if the freshness fallback is needed.
- `community/`: clean up `revalidate`; mirror cron/concurrency if needed.

### Verification (manual, no SSR)
- Publish a Sanity change → **no** build fires automatically.
- Open Presentation in Studio → draft edits show live against the preview site; overlays work.
- Click Deploy → one build runs, live in ~5 min.
- Create an event with a recent past `endDateTime` → confirm it drops at the next scheduled build;
  time that gap against the agreed staleness window.
- Trigger overlapping builds (manual + cron) → one cancels cleanly, no partial deploy.
