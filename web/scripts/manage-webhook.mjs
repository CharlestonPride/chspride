/**
 * Inspect and toggle the Sanity static-build webhook.
 *
 * Usage (from /web):
 *   SANITY_API_TOKEN=<token> node scripts/manage-webhook.mjs [status|enable|disable]
 *
 * Defaults to "status" if no command is given.
 *
 * Prints the full API response so auth/permission failures are visible.
 */

const PROJECT_ID = "jgra26o6";
const WEBHOOK_ID = "tcedua7Dn7rK5ANI";
const HOOKS_BASE = `https://api.sanity.io/v2021-10-04/hooks/projects/${PROJECT_ID}`;

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("Error: SANITY_API_TOKEN env var is required.");
  process.exit(1);
}

const command = process.argv[2] ?? "status";
if (!["status", "enable", "disable"].includes(command)) {
  console.error(`Unknown command "${command}". Use: status | enable | disable`);
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

async function apiCall(method, url, body) {
  const res = await fetch(url, {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  return { ok: res.ok, status: res.status, body: json ?? text };
}

async function getWebhook() {
  return apiCall("GET", `${HOOKS_BASE}/${WEBHOOK_ID}`);
}

async function patchWebhook(patch) {
  return apiCall("PATCH", `${HOOKS_BASE}/${WEBHOOK_ID}`, patch);
}

function printWebhook(hook) {
  console.log(`  Name:       ${hook.name ?? "(unnamed)"}`);
  console.log(`  URL:        ${hook.url}`);
  console.log(`  Dataset:    ${hook.dataset ?? "(all)"}`);
  console.log(`  Disabled:   ${hook.isDisabled ?? false}`);
  if (hook.isDisabledByUser !== undefined) {
    console.log(`  Dis. by user: ${hook.isDisabledByUser}`);
  }
  if (hook.description) {
    console.log(`  Description: ${hook.description}`);
  }
}

async function main() {
  if (command === "status") {
    console.log(`Fetching webhook ${WEBHOOK_ID}...`);
    const { ok, status, body } = await getWebhook();
    console.log(`HTTP ${status}`);
    if (!ok) {
      console.error("Request failed. Full response:");
      console.error(JSON.stringify(body, null, 2));
      process.exit(1);
    }
    console.log("\nWebhook details:");
    printWebhook(body);
    console.log("\nFull response:");
    console.log(JSON.stringify(body, null, 2));
    return;
  }

  const disabled = command === "disable";
  console.log(`${disabled ? "Disabling" : "Enabling"} webhook ${WEBHOOK_ID}...`);

  const { ok, status, body } = await patchWebhook({ isDisabled: disabled });
  console.log(`HTTP ${status}`);

  if (!ok) {
    console.error("Request failed. Full response:");
    console.error(JSON.stringify(body, null, 2));
    process.exit(1);
  }

  console.log(`\nWebhook ${disabled ? "disabled" : "enabled"} successfully.`);
  printWebhook(body);
}

main();
