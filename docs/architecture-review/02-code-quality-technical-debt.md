## Summary

A review of the codebase reveals significant technical debt across all packages. This issue catalogues code quality problems, architectural inconsistencies, and areas that need refactoring.

---

## Type Safety & TypeScript

### Widespread `as any` Usage (~35+ instances)
**Locations:** `web/sanity.config.ts`, `web/plugins/settings.tsx`, `web/components/PageBuilder.tsx`, `community/components/PortableText.tsx`

TypeScript's type safety is being routinely bypassed with `as any` casts and non-null assertions (`!.`). Examples:
- `sponsorship.sponsor!.name` in SponsorCard.tsx
- `footer!.email` in Footer.tsx  
- `components as any` in PortableText.tsx
- `const ec = c as any` in PageBuilder.tsx

**Recommendation:** Create proper type definitions for CMS data structures. Use generated Sanity types (which already exist via `typegen`) throughout components.

### Untyped Component Props
**Location:** `web/components/portableText/Link.tsx`

```typescript
export default function LinkMark({ value, children }: any) {
```

**Recommendation:** Define proper Props interfaces for all components.

---

## Code Duplication

### Near-Identical Form Components (636 lines each)
**Location:** `community/components/SubmitEventForm.tsx` and `community/components/SubmitResourceForm.tsx`

These two components are ~90% identical. They share the same form structure, validation patterns, image upload logic, and submission flow.

**Recommendation:** Extract a shared `FormBuilder` or `SubmissionForm` component that accepts configuration for field definitions.

### Duplicated Sanity Client Setup
**Locations:** `web/sanity/lib/client.ts`, `community/sanity/lib/client.ts`

Both packages independently configure the Sanity client with the same project ID, dataset, and API version.

**Recommendation:** Consider extracting shared Sanity configuration to a root-level `packages/sanity-config` (or at minimum document why they diverge).

### Duplicated Azure Functions Logic
**Locations:** `functions/src/functions/submitEvent.mjs`, `functions/src/functions/submitResource.mjs`

Both share identical patterns for: multipart parsing, reCAPTCHA validation, image upload to Sanity, Slack notifications, and email confirmations.

**Recommendation:** Extract shared middleware/handlers for common steps (parse → validate → upload → notify → respond).

---

## Missing Error Handling

### Unhandled Promise Rejections in Client Components
**Location:** `web/components/card/UpcomingEventsCard.tsx`

```typescript
useEffect(() => {
  client.fetch<EventSummary[]>(eventsQuery).then(setEvents);
  // No .catch() handler
}, []);
```

### No Error Boundaries or Error Pages
**Locations:** Both `web/app/` and `community/app/` are missing:
- `error.tsx` (React error boundary)
- `global-error.tsx` (root error boundary)  
- `loading.tsx` (suspense fallback)
- `not-found.tsx` (custom 404 in community)

**Recommendation:** Add error boundaries at route segment level and implement user-friendly error states.

---

## Incomplete Features

### Abandoned Guide Tool
**Location:** `web/tools/guide.tsx`

Contains only `<Text>TODO</Text>` — an incomplete Sanity Studio tool that should either be implemented or removed.

### Console.log with Typo in Production
**Location:** `web/sanity/lib/utils.ts`

```javascript
console.log("ref underined");
```

A debug log with a typo left in production code.

---

## Architecture Inconsistencies

| Area | Web App | Community App |
|------|---------|---------------|
| CSS Framework | Bootstrap 5 + SCSS | Tailwind CSS |
| Component Pattern | PageBuilder (CMS-driven) | Inline JSX (hardcoded) |
| Image Handling | SanityImage component | Raw `<img>` with eslint-disable |
| Data Fetching | Server Components | Mix of server + client |
| Navigation | CMS-managed | Hardcoded links |

While the apps serve different purposes, the complete divergence in patterns makes maintenance harder for a single-person team.

**Recommendation:** Document the intentional differences and consider unifying at least the Sanity image/client patterns.

---

## Performance Issues

### Image Optimization Disabled
**Locations:** Both `web/next.config.mjs` and `community/next.config.mjs` set `images: { unoptimized: true }`

This disables Next.js automatic image optimization (resizing, format conversion, lazy loading). For a media-heavy event site, this creates significant performance penalties on mobile.

**Recommendation:** Use Next.js Image component with a configured loader (Sanity has a built-in one) instead of raw `<img>` tags.

### Client-Side Filtering Without Debounce
**Location:** `community/components/ResourceFilters.tsx`

All resources are fetched at once and filtered in-memory on every keystroke without debouncing.

**Recommendation:** Add search debouncing (300ms) and consider server-side GROQ filtering for larger datasets.

### Hardcoded Query Limits
**Location:** `community/sanity/lib/queries.ts`

```groq
[0...20]   // homepage events
[0...200]  // all events page
```

No pagination support — will fail silently when content exceeds limits.

---

## Deprecated Patterns

### Legacy Sass APIs
**Location:** `web/next.config.mjs`

Multiple `silenceDeprecations` suppress warnings for deprecated Sass features (`legacy-js-api`, `import`, `color-functions`). These will break in future Sass versions.

**Recommendation:** Migrate to modern Sass module syntax (`@use` instead of `@import`).

---

## Checklist

- [ ] Eliminate `as any` casts — use generated Sanity types
- [ ] Extract shared form component in community app
- [ ] Add `.catch()` handlers to all client-side fetches
- [ ] Add error.tsx and not-found.tsx to both apps
- [ ] Remove or complete the guide tool
- [ ] Remove debug console.log statements
- [ ] Enable image optimization
- [ ] Add debouncing to search filters
- [ ] Migrate deprecated Sass patterns
- [ ] Document architectural differences between apps
