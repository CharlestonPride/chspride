/**
 * Delete past events from a Sanity dataset.
 *
 * An event is considered past when it has fully ended:
 *   - If endDateTime is set: endDateTime < now
 *   - If no endDateTime:     startDateTime < now
 * Events that have started but not yet ended are left untouched.
 *
 * Usage (from /web):
 *   SANITY_API_TOKEN=<token> node scripts/purge-past-events.mjs [options]
 *
 * Options:
 *   --dataset <name>   Target dataset (default: production)
 *   --dry-run          List matching events without deleting
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = "jgra26o6";
const API_VERSION = "2024-08-04";

const args = process.argv.slice(2);
const datasetIdx = args.indexOf("--dataset");
const DATASET = datasetIdx >= 0 ? args[datasetIdx + 1] : "production";
const DRY_RUN = args.includes("--dry-run");

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

const query = `*[_type == "event" && (
  (defined(endDateTime) && endDateTime < now()) ||
  (!defined(endDateTime) && startDateTime < now())
)] { _id, name, startDateTime, endDateTime }`;

async function main() {
  const fetchClient = DRY_RUN
    ? createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false })
    : client;

  const events = await fetchClient.fetch(query);
  console.log(`Found ${events.length} past event(s) on dataset "${DATASET}".`);

  if (events.length === 0) return;

  for (const ev of events) {
    const end = ev.endDateTime ?? ev.startDateTime;
    console.log(`  ${DRY_RUN ? "[dry-run] " : ""}${ev.name} — ended ${new Date(end).toLocaleDateString("en-US")}`);
  }

  if (DRY_RUN) {
    console.log("\nDry run — nothing deleted.");
    return;
  }

  const tx = client.transaction();
  for (const ev of events) {
    tx.delete(ev._id);
  }

  try {
    const result = await tx.commit();
    console.log(`Deleted ${result.results.length} event(s).`);
  } catch (err) {
    console.error("Purge failed:", err.message);
    process.exit(1);
  }
}

main();
