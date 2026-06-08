## Summary

The CI/CD pipelines, infrastructure configuration, and developer experience tooling have several issues that should be addressed to improve reliability, maintainability, and onboarding.

---

## CI/CD Workflow Issues

### Poorly Named Workflow Files
**Location:** `.github/workflows/`

Current files:
- `azure-static-web-apps-kind-ground-0e3e1060f.yml` (Web production)
- `azure-static-web-apps-nice-glacier-0b8f1c80f.yml` (Web preview)
- `azure-static-web-apps-polite-desert-0cce4610f.yml` (Community)
- `deploy-functions.yml` (Functions — good name ✅)

The auto-generated Azure names are impossible to understand at a glance.

**Recommendation:** Rename to `deploy-web-production.yml`, `deploy-web-preview.yml`, `deploy-community.yml`.

---

### No Build Verification in CI
The Azure Static Web Apps workflows rely on `scm-do-build-during-deployment: true` and `enable-oryx-build: true`, meaning builds happen at deploy time rather than in CI.

**Impact:** Build failures are only discovered during deployment, not during PR checks.

**Recommendation:** Add an explicit `npm run build` step before the Azure deployment action.

---

### No Dependency Security Scanning
None of the workflows run `npm audit` or use Dependabot/CodeQL scanning.

**Recommendation:** Add `npm audit --audit-level=moderate` as a CI step and/or enable Dependabot alerts.

---

### Preview Mode Exposed in Workflow YAML
**Location:** `.github/workflows/azure-static-web-apps-nice-glacier-0b8f1c80f.yml:36`

```yaml
NEXT_PUBLIC_PREVIEW_MODE: "true"
```

This is a public environment variable visible in the YAML file.

**Recommendation:** Set via Azure Static Web Apps application settings instead.

---

## Node.js Version Inconsistency

| Package | Required Node Version |
|---------|----------------------|
| Root `package.json` | `>=24.0.0` |
| `functions/package.json` | `>=20.0.0` |
| Web workflow | Node 24 |
| Community workflow | Node 24 |
| Functions workflow | Node 20 |

**Recommendation:** Standardize to Node 24 across all packages, or document why functions must remain on 20 (Azure Functions runtime constraints). Add an `.nvmrc` or `.node-version` file at root.

---

## Missing Developer Experience Tooling

### No Testing Framework
None of the three packages have any test files, test configuration, or testing dependencies.

**Impact:** No way to verify correctness of business logic, component rendering, or API behavior. Any refactoring is high-risk.

**Recommendation:** 
- Add Vitest + React Testing Library to `web/` and `community/`
- Add Vitest to `functions/` for unit testing Azure Functions
- Start with critical paths: form submission, event queries, CORS logic

---

### No Error Monitoring
No error tracking service (Sentry, LogRocket, Application Insights) is configured for any package.

**Impact:** Production errors go undetected unless a user reports them.

**Recommendation:** Add Azure Application Insights (free tier) to the Functions and Sentry (free tier) to the web apps.

---

### No Shared ESLint Configuration
- `web/` has `.eslintrc.json` with minimal `next/core-web-vitals` only
- `community/` has no ESLint config
- `functions/` has no ESLint config

**Recommendation:** Create a shared ESLint config at root with security rules (`eslint-plugin-security`), and extend it in each package.

---

### Missing Contributing Documentation
No `CONTRIBUTING.md`, `SECURITY.md`, or deployment runbooks exist.

**Recommendation:** Add:
- `CONTRIBUTING.md` — how to set up local dev, run each app, and submit PRs
- `SECURITY.md` — how to report vulnerabilities
- Deployment documentation for each package

---

## Infrastructure Configuration

### Static Export Limitations
Both `web/` and `community/` use `output: "export"` in Next.js config, which means:
- No server-side rendering
- No API routes
- No middleware
- No incremental static regeneration
- No dynamic error pages

This is fine for cost reasons but limits future capabilities significantly.

**Recommendation:** Document this as an intentional architectural decision. Consider hybrid rendering if dynamic features are needed in the future.

---

### Mobile App Points to Hardcoded Production URL
**Location:** `mobile/capacitor.config.json`

```json
"url": "https://charlestonpride.org"
```

Cannot test against staging/preview without rebuilding the app.

**Recommendation:** Support environment-based URL configuration or a debug settings panel.

---

### Splash Screen Theme Mismatch
**Location:** `community/capacitor.config.json`

```json
"backgroundColor": "#FFFFFF"
```

The community app uses a dark theme (`#0a0812`) but the splash screen is white, creating a jarring flash.

**Recommendation:** Set splash background to match the app theme.

---

## Checklist

- [ ] Rename workflow files to descriptive names
- [ ] Add build verification step to CI
- [ ] Add `npm audit` to CI pipelines
- [ ] Standardize Node.js version and add `.nvmrc`
- [ ] Add Vitest to at least one package as a starting point
- [ ] Add error monitoring (Application Insights / Sentry)
- [ ] Create shared ESLint configuration
- [ ] Add CONTRIBUTING.md and SECURITY.md
- [ ] Document static export trade-offs
- [ ] Fix splash screen theme mismatch
