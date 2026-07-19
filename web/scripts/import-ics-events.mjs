/**
 * Import events from a Google Calendar ICS export into Sanity.
 *
 * Usage (from /web):
 *   SANITY_API_TOKEN=<token> node scripts/import-ics-events.mjs <path-to-ics> [options]
 *
 * Options:
 *   --dataset <name>   Target dataset (default: test)
 *   --show-on-cp       Set showOnCP=true on all events (default: false)
 *   --no-show-on-uip   Set showOnUIP=false on all events (default: true)
 *   --dry-run          Print documents without writing to Sanity
 *
 * Re-running is safe — existing documents with the same ICS UID are replaced.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const PROJECT_ID = "jgra26o6";
const API_VERSION = "2024-08-04";

// --- CLI args ---
const args = process.argv.slice(2);
const icsPath = args.find((a) => !a.startsWith("--"));
if (!icsPath) {
  console.error(
    "Usage: node scripts/import-ics-events.mjs <path-to-ics> [--dataset test] [--show-on-cp] [--dry-run]"
  );
  process.exit(1);
}

const datasetIdx = args.indexOf("--dataset");
const DATASET = datasetIdx >= 0 ? args[datasetIdx + 1] : "test";
const SHOW_ON_CP = args.includes("--show-on-cp");
const SHOW_ON_UIP = !args.includes("--no-show-on-uip");
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

// --- ICS parsing ---

function unfoldLines(text) {
  // ICS folds long lines with CRLF + whitespace; rejoin them
  return text.replace(/\r?\n[ \t]/g, "");
}

function unescapeICS(value) {
  return value
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\n/gi, "\n")
    .replace(/\\\\/g, "\\");
}

function stripHTML(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

let _keyCounter = 0;
function nextKey() {
  return (++_keyCounter).toString(36).padStart(4, "0");
}

function htmlToPortableText(html) {
  if (!html?.trim()) return undefined;

  // Strip elements that are dangerous or produce no useful content
  let safe = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "");

  // Strip event-handler attributes and javascript: href values
  safe = safe
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/href\s*=\s*"javascript:[^"]*"/gi, "")
    .replace(/href\s*=\s*'javascript:[^']*'/gi, "");

  // Convert block-level close tags to paragraph breaks
  safe = safe
    .replace(/<\/(?:p|div|li|td|th|blockquote|h[1-6])>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n");

  // Strip all remaining tags
  safe = safe.replace(/<[^>]+>/g, "");

  // Decode entities and normalize whitespace
  safe = decodeEntities(safe);

  const paragraphs = safe
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return undefined;

  return paragraphs.map((text) => {
    const bk = nextKey();
    return {
      _type: "block",
      _key: bk,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: bk + "s", text, marks: [] }],
    };
  });
}

// Returns whether a local ET date is in DST (EDT = UTC-4)
function isEDT(date) {
  const y = date.getFullYear();
  // 2nd Sunday in March
  const mar = new Date(y, 2, 1);
  while (mar.getDay() !== 0) mar.setDate(mar.getDate() + 1);
  mar.setDate(mar.getDate() + 7); // advance to 2nd Sunday
  // 1st Sunday in November
  const nov = new Date(y, 10, 1);
  while (nov.getDay() !== 0) nov.setDate(nov.getDate() + 1);
  return date >= mar && date < nov;
}

function parseICSDate(value, param) {
  if (param?.includes("VALUE=DATE")) {
    // All-day: YYYYMMDD — treat as noon UTC
    const [y, mo, d] = [value.slice(0, 4), value.slice(4, 6), value.slice(6, 8)];
    return `${y}-${mo}-${d}T12:00:00.000Z`;
  }

  // YYYYMMDDTHHmmss[Z]
  const [y, mo, d, h, mi, s] = [
    value.slice(0, 4),
    value.slice(4, 6),
    value.slice(6, 8),
    value.slice(9, 11),
    value.slice(11, 13),
    value.slice(13, 15),
  ];

  if (value.endsWith("Z")) {
    return `${y}-${mo}-${d}T${h}:${mi}:${s}.000Z`;
  }

  // Local time with TZID (assume America/New_York)
  const local = new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}`);
  const offsetHours = isEDT(local) ? 4 : 5;
  return new Date(local.getTime() + offsetHours * 3_600_000).toISOString();
}

function parseLocation(raw) {
  if (!raw?.trim()) return undefined;

  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts[parts.length - 1]?.toUpperCase() === "USA") parts.pop();
  if (parts.length === 0) return undefined;
  if (parts.length === 1) return { venue: parts[0] };

  // Detect "SC 29401" or "SC  29401" at the end
  const stateZip = /^([A-Z]{2})\s+(\d{5})$/.exec(parts[parts.length - 1]);
  if (stateZip) {
    const [, state, zip] = stateZip;
    const n = parts.length;
    return {
      ...(n >= 5 && { venue: parts.slice(0, n - 3).join(", ") }),
      ...(n === 4 && { venue: parts[0] }),
      ...(n >= 4 && { address: parts[n - 3] }),
      ...(n >= 3 && { city: parts[n - 2] }),
      state,
      zip,
    };
  }

  // Fallback: first part is venue, rest is address
  return { venue: parts[0], address: parts.slice(1).join(", ") };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function toSanityId(uid) {
  return "ics-" + uid.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function parseICS(text) {
  const lines = unfoldLines(text).split(/\r?\n/);
  const events = [];
  let current = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { current = {}; continue; }
    if (line === "END:VEVENT") { if (current) events.push(current); current = null; continue; }
    if (!current) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx < 0) continue;

    const propFull = line.slice(0, colonIdx);
    const value = unescapeICS(line.slice(colonIdx + 1));
    const semiIdx = propFull.indexOf(";");
    const name = semiIdx >= 0 ? propFull.slice(0, semiIdx) : propFull;
    const param = semiIdx >= 0 ? propFull.slice(semiIdx + 1) : "";

    current[name] = { value, param };
  }

  return events;
}

function toSanityDoc(ev) {
  const uid = ev.UID?.value;
  const name = ev.SUMMARY?.value?.trim();
  if (!uid || !name) return null;

  const startDateTime = ev.DTSTART
    ? parseICSDate(ev.DTSTART.value, ev.DTSTART.param)
    : null;
  if (!startDateTime) return null;
  if (new Date(startDateTime) < new Date()) return null;

  const endDateTime = ev.DTEND
    ? parseICSDate(ev.DTEND.value, ev.DTEND.param)
    : undefined;

  const rawDesc = ev.DESCRIPTION?.value ?? "";
  const plain = stripHTML(rawDesc);

  const ageRestriction = /21\+/.test(plain)
    ? "21+"
    : /18\+/.test(plain)
    ? "18+"
    : "all-ages";

  const agePrefix = /^(?:21\+|18\+)\s*/;

  const trimmedPlain = plain.replace(agePrefix, "").trim();
  const description = trimmedPlain.slice(0, 197).trimEnd();
  const truncated = trimmedPlain.length > 197 ? description + "..." : description;

  const rawContent = htmlToPortableText(rawDesc);
  const content = rawContent && ageRestriction !== "all-ages"
    ? (() => {
        const blocks = [...rawContent];
        const first = blocks[0];
        if (first?.children?.[0]) {
          const trimmed = first.children[0].text.replace(agePrefix, "").trim();
          if (trimmed) {
            blocks[0] = { ...first, children: [{ ...first.children[0], text: trimmed }] };
          } else {
            blocks.shift();
          }
        }
        return blocks.length > 0 ? blocks : undefined;
      })()
    : rawContent;

  const location = parseLocation(ev.LOCATION?.value);

  // Append the year to the slug to reduce collisions for recurring events
  const year = startDateTime.slice(0, 4);
  const slug = `${slugify(name)}-${year}`;

  return {
    _id: toSanityId(uid),
    _type: "event",
    name,
    slug: { _type: "slug", current: slug },
    ...(truncated && { description: truncated }),
    ...(content && { content }),
    startDateTime,
    ...(endDateTime && { endDateTime }),
    ...(location && { location }),
    isFree: true,
    ageRestriction,
    isFeatured: false,
    ctaLabel: "More Info",
    showOnCP: SHOW_ON_CP,
    showOnUIP: SHOW_ON_UIP,
  };
}

// --- Main ---

async function main() {
  const icsText = readFileSync(resolve(icsPath), "utf8");
  const rawEvents = parseICS(icsText);
  console.log(`Parsed ${rawEvents.length} VEVENT blocks from ICS.`);

  const docs = rawEvents.map(toSanityDoc).filter(Boolean);
  console.log(`Mapped ${docs.length} valid event documents.`);

  if (DRY_RUN) {
    console.log(JSON.stringify(docs, null, 2));
    return;
  }

  console.log(`Writing to dataset "${DATASET}"...`);
  const tx = client.transaction();
  for (const doc of docs) {
    tx.createOrReplace(doc);
  }

  try {
    const result = await tx.commit();
    console.log(`Done. ${result.results.length} documents written.`);
  } catch (err) {
    console.error("Import failed:", err.message);
    process.exit(1);
  }
}

main();
