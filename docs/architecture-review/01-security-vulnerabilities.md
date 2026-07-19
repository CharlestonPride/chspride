## Summary

A comprehensive security audit of the monorepo has identified several vulnerabilities across the `functions/`, `web/`, and `community/` packages that should be addressed before production traffic increases.

---

## 🔴 Critical

### 1. XSS in Azure Functions Email Templates
**Location:** `functions/src/functions/submitEvent.mjs`, `submitResource.mjs`, `contactForm.mjs`

User-supplied data (names, event titles, messages) is embedded directly into HTML email templates without sanitization. An attacker could inject malicious HTML/JavaScript through form fields.

**Recommendation:** HTML-escape all user input before embedding in templates (e.g., use `lodash.escape` or a dedicated `xss` library).

---

### 2. CORS Fallback to Wildcard
**Location:** `functions/src/lib/cors.mjs:11`

```javascript
const origin = allowed.includes(requestOrigin) ? requestOrigin : allowed[0] ?? "*";
```

If `CORS_ALLOWED_ORIGINS` is empty or undefined, the function falls back to `"*"`, allowing any origin to access sensitive endpoints.

**Recommendation:** Return a 403 or use a strict default origin instead of `"*"`.

---

### 3. reCAPTCHA Bypass Available in Production
**Location:** `functions/src/lib/recaptcha.mjs:8`

```javascript
if (process.env.RECAPTCHA_BYPASS === "true") {
  return { success: true, score: 1.0 };
}
```

If this environment variable is accidentally enabled in production, all reCAPTCHA protection is disabled across all form endpoints.

**Recommendation:** Gate the bypass behind `NODE_ENV !== "production"` or remove it entirely and use integration test mocking instead.

---

### 4. Unsanitized Iframe URLs
**Location:** `web/components/card/ExternalCard.tsx`

The `src` prop is passed directly to an `<iframe>` without URL validation. A malicious or misconfigured CMS entry could inject a `javascript:` or data URL.

**Recommendation:** Validate the URL protocol is `https:` before rendering.

---

## 🟠 High

### 5. API Token in Client-Exposed Environment Variable
**Location:** `web/sanity/lib/previewClient.ts`

Uses `NEXT_PUBLIC_SANITY_API_READ_TOKEN` which is exposed to the browser bundle. This token could be extracted and used for unauthorized queries against the Sanity dataset.

**Recommendation:** Move preview functionality to a server-only route handler or API route, using a non-public env variable.

---

### 6. No Input Validation on Form Submissions
**Location:** `community/components/ContactForm.tsx`, `SubmitEventForm.tsx`, `SubmitResourceForm.tsx`; `functions/src/functions/`

- No email format validation on the server
- No file MIME type validation (only size is checked on client)
- No input length limits on the server (JSON body could be arbitrarily large)
- No slug empty-string validation

**Recommendation:**
- Add server-side email regex validation
- Validate file Content-Type header against allowed MIME types
- Set `Content-Length` limits on the Azure Function
- Validate that generated slugs are non-empty

---

### 7. Deploy Hook Exposed Without Authentication
**Location:** `web/tools/deploy.tsx`

The deploy hook URL is visible in client code and can be triggered without authentication, CSRF protection, or rate limiting.

**Recommendation:** Move the deploy trigger to a server-side API route with authentication, or add a shared secret to the hook request.

---

### 8. GitHub PAT in Functions
**Location:** `functions/src/functions/buildStatic.mjs:34`

A GitHub Personal Access Token is used in plaintext in the Authorization header to trigger workflow dispatches. If this function is compromised, the token grants access to repository workflows.

**Recommendation:** Use a scoped fine-grained PAT with minimum permissions, add IP-based access restrictions, and validate the caller via shared secret.

---

## 🟡 Medium

### 9. No Content Security Policy Headers
**Location:** `web/next.config.mjs`, `community/next.config.mjs`

Neither app configures CSP headers, leaving them vulnerable to script injection.

**Recommendation:** Add security headers via `next.config.mjs` headers configuration or a middleware.

### 10. Silent Service Failures
**Location:** `functions/src/lib/email.mjs`, `functions/src/lib/slack.mjs`

If SendGrid or Slack credentials are missing, functions silently succeed without notifying anyone. Form submissions appear successful but no notification reaches the team.

**Recommendation:** Log warnings clearly and consider returning a degraded-but-honest response.

---

## Checklist

- [ ] Escape user input in email templates
- [ ] Fix CORS wildcard fallback
- [ ] Gate reCAPTCHA bypass behind NODE_ENV
- [ ] Validate iframe URLs in ExternalCard
- [ ] Move Sanity preview token to server-only
- [ ] Add server-side input validation
- [ ] Secure deploy hook endpoint
- [ ] Scope GitHub PAT permissions
- [ ] Add CSP headers to both apps
- [ ] Add logging for missing service credentials
