/**
 * Generic Sanity document importer — reads a JSON array of documents and
 * upserts them via createOrReplace. Temporarily disables the static-build
 * webhook during the write to avoid triggering a deploy for every mutation.
 *
 * Usage (from /web):
 *   SANITY_API_TOKEN=<token> node scripts/import-sanity-docs.mjs <path-to-json> [options]
 *
 * Options:
 *   --dataset <name>        Target dataset (default: test)
 *   --dry-run               Print documents without writing to Sanity
 *   --no-disable-webhooks   Skip disabling the static-build webhook
 *
 * Re-running is safe — existing documents with the same _id are replaced.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const PROJECT_ID = "jgra26o6";
const API_VERSION = "2024-08-04";
const STATIC_BUILD_WEBHOOK_ID = "tcedua7Dn7rK5ANI";
const HOOKS_API = `https://api.sanity.io/v2021-10-04/hooks/projects/${PROJECT_ID}`;

// --- CLI args ---
const args = process.argv.slice(2);
const filePath = args.find((a) => !a.startsWith("--"));

if (!filePath) {
  console.error(
    "Usage: node scripts/import-sanity-docs.mjs <path-to-json> [--dataset test] [--dry-run] [--no-disable-webhooks]"
  );
  process.exit(1);
}

const datasetIdx = args.indexOf("--dataset");
const DATASET = datasetIdx >= 0 ? args[datasetIdx + 1] : "test";
const DRY_RUN = args.includes("--dry-run");
const MANAGE_WEBHOOK = !args.includes("--no-disable-webhooks");

const token = process.env.SANITY_API_TOKEN;
if (!token && !DRY_RUN) {
  console.error("Error: SANITY_API_TOKEN env var is required.");
  process.exit(1);
}

const client = DRY_RUN
  ? null
  : createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: API_VERSION,
      token,
      useCdn: false,
    });

// --- Webhook helpers ---
async function setWebhookDisabled(disabled) {
  const res = await fetch(`${HOOKS_API}/${STATIC_BUILD_WEBHOOK_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isDisabled: disabled }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} — ${text}`);
  }
  return res.json();
}

async function disableWebhook() {
  await setWebhookDisabled(true);
  console.log(`  Webhook ${STATIC_BUILD_WEBHOOK_ID} disabled.`);
}

async function enableWebhook() {
  try {
    await setWebhookDisabled(false);
    console.log(`  Webhook ${STATIC_BUILD_WEBHOOK_ID} re-enabled.`);
  } catch (err) {
    console.warn(`  Warning: could not re-enable webhook — ${err.message}`);
    console.warn(
      `  Re-enable it manually at https://www.sanity.io/manage/personal/project/${PROJECT_ID}/api#webhooks`
    );
  }
}

// --- Main ---
async function main() {
  // Read and parse the import file
  let docs;
  try {
    const raw = readFileSync(resolve(filePath), "utf8");
    docs = JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading "${filePath}": ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(docs)) {
    console.error("Error: JSON file must contain an array of documents.");
    process.exit(1);
  }

  // Validate each document has the minimum required fields
  const invalid = docs.filter((d) => !d._id || !d._type);
  if (invalid.length > 0) {
    console.error(
      `Error: ${invalid.length} document(s) are missing _id or _type:`
    );
    invalid.forEach((d) => console.error(`  ${JSON.stringify(d).slice(0, 80)}`));
    process.exit(1);
  }

  // Summary by type
  const byType = docs.reduce((acc, d) => {
    acc[d._type] = (acc[d._type] ?? 0) + 1;
    return acc;
  }, {});
  const typeSummary = Object.entries(byType)
    .map(([t, n]) => `${n} ${t}`)
    .join(", ");

  console.log(`Loaded ${docs.length} documents from "${filePath}" (${typeSummary}).`);

  if (DRY_RUN) {
    console.log(`\n[DRY RUN] Would write to dataset "${DATASET}":\n`);
    console.log(JSON.stringify(docs, null, 2));
    return;
  }

  console.log(`Target dataset: "${DATASET}"`);

  // Disable static-build webhook before writing
  if (MANAGE_WEBHOOK) {
    console.log("\nDisabling static-build webhook...");
    try {
      await disableWebhook();
    } catch (err) {
      console.error(`  Failed to disable webhook — ${err.message}`);
      console.error("  Aborting. Use --no-disable-webhooks to skip this check.");
      process.exit(1);
    }
  }

  // Upsert all documents in one transaction
  console.log(`\nWriting ${docs.length} documents...`);
  try {
    const tx = client.transaction();
    for (const doc of docs) {
      tx.createOrReplace(doc);
    }
    const result = await tx.commit();
    console.log(`Done. ${result.results.length} documents written.`);
  } catch (err) {
    console.error(`\nImport failed: ${err.message}`);
    if (MANAGE_WEBHOOK) {
      console.log("\nRe-enabling webhook before exit...");
      await enableWebhook();
    }
    process.exit(1);
  }

  // Re-enable the webhook
  if (MANAGE_WEBHOOK) {
    console.log("\nRe-enabling static-build webhook...");
    await enableWebhook();
  }
}

main();
