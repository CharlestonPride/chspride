/**
 * Seed the Sanity "test" dataset with representative UIP data.
 *
 * Usage (from /web):
 *   SANITY_API_TOKEN=<token> node scripts/seed-test.mjs
 *
 * Requires a Sanity API token with write access to the test dataset.
 * Generate one at https://www.sanity.io/manage → project → API → Tokens.
 *
 * Running this script multiple times is safe — existing documents with the
 * same _id will be replaced (createOrReplace).
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = "jgra26o6";
const DATASET = "test";
const API_VERSION = "2024-08-04";

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("Error: SANITY_API_TOKEN env var is required.");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Dates relative to now so the seed data stays current
// ---------------------------------------------------------------------------
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
const events = [
  {
    _id: "seed-event-pride-festival",
    _type: "event",
    name: "Charleston Pride Festival 2026",
    slug: { _type: "slug", current: "charleston-pride-festival-2026" },
    description:
      "The annual Charleston Pride Festival returns to Marion Square. Live music, performers, food vendors, and community organizations celebrating LGBTQ+ pride.",
    content: [
      {
        _type: "block",
        _key: "block1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span1",
            text: "Join us for the biggest Pride celebration in the Lowcountry! Marion Square will be transformed into a vibrant festival space with multiple stages, local vendors, food trucks, and a family-friendly atmosphere.",
          },
        ],
      },
    ],
    startDateTime: daysFromNow(45),
    endDateTime: daysFromNow(46),
    isFree: true,
    ageRestriction: "all-ages",
    isFeatured: true,
    ctaLabel: "Learn More",
    showOnCP: true,
    showOnUIP: true,
    keywords: ["festival", "pride", "music", "community"],
    location: {
      venue: "Marion Square",
      address: "329 Meeting St",
      city: "Charleston",
      state: "SC",
      zip: "29403",
    },
  },
  {
    _id: "seed-event-drag-brunch",
    _type: "event",
    name: "Drag Brunch & Mimosas",
    slug: { _type: "slug", current: "drag-brunch-mimosas" },
    description:
      "Start your Sunday right with an extravagant drag brunch featuring local queens, bottomless mimosas, and a fabulous menu.",
    startDateTime: daysFromNow(10),
    endDateTime: daysFromNow(10),
    isFree: false,
    price: "$45 per person (includes bottomless mimosas)",
    ageRestriction: "21+",
    isFeatured: false,
    ctaLabel: "Get Tickets",
    showOnCP: false,
    showOnUIP: true,
    keywords: ["drag", "brunch", "entertainment"],
    location: {
      venue: "The Cocktail Club",
      address: "479 King St",
      city: "Charleston",
      state: "SC",
      zip: "29403",
    },
    tickets: {
      url: "https://example.com/tickets/drag-brunch",
      embedMode: "tab",
      isSoldOut: false,
      soldOutMessage: "Tickets are sold out.",
      unavailableMessage: "Tickets are not currently available.",
    },
  },
  {
    _id: "seed-event-youth-group",
    _type: "event",
    name: "LGBTQ+ Youth Group — Monthly Meetup",
    slug: { _type: "slug", current: "lgbtq-youth-group-monthly" },
    description:
      "A safe, supportive space for LGBTQ+ youth ages 14–20. Share stories, make friends, and connect with peers and mentors.",
    startDateTime: daysFromNow(7),
    endDateTime: daysFromNow(7),
    isFree: true,
    ageRestriction: "all-ages",
    isFeatured: false,
    ctaLabel: "More Info",
    showOnCP: false,
    showOnUIP: true,
    keywords: ["youth", "support", "community"],
    location: {
      venue: "AFFA Community Center",
      address: "PO Box 1668",
      city: "Charleston",
      state: "SC",
      zip: "29402",
    },
  },
  {
    _id: "seed-event-art-exhibition",
    _type: "event",
    name: "Queer Art Exhibition Opening Night",
    slug: { _type: "slug", current: "queer-art-exhibition-opening" },
    description:
      "Opening reception for 'Visibility' — a group exhibition featuring works by LGBTQ+ artists from the Lowcountry. Free and open to the public.",
    startDateTime: daysFromNow(21),
    endDateTime: daysFromNow(21),
    isFree: true,
    ageRestriction: "all-ages",
    isFeatured: true,
    ctaLabel: "RSVP",
    showOnCP: false,
    showOnUIP: true,
    keywords: ["art", "exhibition", "culture"],
    location: {
      venue: "Redux Contemporary Art Center",
      address: "1056 King St",
      city: "Charleston",
      state: "SC",
      zip: "29403",
    },
  },
  {
    _id: "seed-event-rainbow-run",
    _type: "event",
    name: "Rainbow Run 5K",
    slug: { _type: "slug", current: "rainbow-run-5k" },
    description:
      "Run or walk through historic Charleston while getting doused in rainbow colors! All fitness levels welcome. Proceeds support Charleston Pride programming.",
    startDateTime: daysFromNow(30),
    endDateTime: daysFromNow(30),
    isFree: false,
    price: "$35 early bird / $45 day-of",
    ageRestriction: "all-ages",
    isFeatured: false,
    ctaLabel: "Register",
    showOnCP: true,
    showOnUIP: true,
    keywords: ["run", "fitness", "fundraiser"],
    location: {
      venue: "Waterfront Park",
      address: "1 Vendue Range",
      city: "Charleston",
      state: "SC",
      zip: "29401",
    },
    registration: {
      label: "Register for the Race",
      description: "Sign up for the Rainbow Run 5K. All participants receive a rainbow color packet and finisher medal.",
      url: "https://example.com/register/rainbow-run",
      embedMode: "tab",
      unavailableMessage: "Registration is not currently available.",
    },
  },
];

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------
const resources = [
  {
    _id: "seed-resource-affa",
    _type: "resource",
    name: "Alliance for Full Acceptance (AFFA)",
    slug: { _type: "slug", current: "affa" },
    category: "supportGroup",
    description:
      "South Carolina's oldest LGBTQ advocacy organization, providing support groups, community events, and resources for LGBTQ+ individuals and families.",
    contact: {
      website: "https://www.affa-sc.org/",
      instagram: "affasc",
      facebook: "https://www.facebook.com/AFFASC",
    },
    location: {
      city: "Charleston",
      state: "SC",
      serviceArea: "Statewide",
    },
    isEmergency: false,
    isVerified: true,
    isFeatured: true,
    showOnUIP: true,
    tags: ["advocacy", "support groups", "statewide"],
  },
  {
    _id: "seed-resource-lowcountry-aids",
    _type: "resource",
    name: "Lowcountry AIDS Services",
    slug: { _type: "slug", current: "lowcountry-aids-services" },
    category: "healthcare",
    description:
      "Providing HIV/AIDS prevention, testing, case management, and direct client services to individuals and families in the Lowcountry.",
    contact: {
      phone: "(843) 747-2273",
      website: "https://www.lowcountryaids.org/",
    },
    location: {
      address: "3547 Meeting St Rd",
      city: "North Charleston",
      state: "SC",
      zip: "29405",
    },
    hours: "Mon–Fri 8:30am–5pm",
    isEmergency: false,
    isVerified: true,
    isFeatured: true,
    showOnUIP: true,
    tags: ["HIV", "AIDS", "testing", "case management"],
  },
  {
    _id: "seed-resource-trevor-project",
    _type: "resource",
    name: "The Trevor Project",
    slug: { _type: "slug", current: "trevor-project" },
    category: "mentalHealth",
    description:
      "Crisis intervention and suicide prevention for LGBTQ+ young people. 24/7 TrevorLifeline, TrevorText, and TrevorChat available.",
    content: [
      {
        _type: "block",
        _key: "tp-block1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "tp-span1",
            text: "If you or someone you know is in crisis, reach out immediately:",
          },
        ],
      },
      {
        _type: "block",
        _key: "tp-block2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "tp-span2",
            text: "TrevorLifeline: 1-866-488-7386 (call or text) — available 24/7",
          },
        ],
      },
    ],
    contact: {
      phone: "1-866-488-7386",
      website: "https://www.thetrevorproject.org/",
    },
    location: {
      isVirtual: true,
      serviceArea: "National — available everywhere",
    },
    hours: "24/7",
    isEmergency: true,
    isVerified: true,
    isFeatured: true,
    showOnUIP: true,
    tags: ["crisis", "youth", "mental health", "24/7", "hotline"],
  },
  {
    _id: "seed-resource-sc-equality",
    _type: "resource",
    name: "SC Equality",
    slug: { _type: "slug", current: "sc-equality" },
    category: "legal",
    description:
      "South Carolina's statewide advocacy organization working for full equality and non-discrimination protections for LGBTQ+ South Carolinians.",
    contact: {
      website: "https://www.sc-equality.org/",
      instagram: "scequality",
    },
    location: {
      city: "Columbia",
      state: "SC",
      serviceArea: "Statewide",
    },
    isEmergency: false,
    isVerified: true,
    isFeatured: false,
    showOnUIP: true,
    tags: ["advocacy", "legal", "policy", "statewide"],
  },
  {
    _id: "seed-resource-waf",
    _type: "resource",
    name: "Women's Alliance for Full Empowerment (WAF)",
    slug: { _type: "slug", current: "waf" },
    category: "supportGroup",
    description:
      "Supporting women in the Lowcountry through economic empowerment, housing assistance, and community programs.",
    contact: {
      website: "https://waf.org/",
    },
    location: {
      city: "Charleston",
      state: "SC",
    },
    isEmergency: false,
    isVerified: true,
    isFeatured: false,
    showOnUIP: true,
    tags: ["women", "housing", "economic empowerment"],
  },
  {
    _id: "seed-resource-musc-health",
    _type: "resource",
    name: "MUSC Health LGBTQ+ Program",
    slug: { _type: "slug", current: "musc-health-lgbtq" },
    category: "healthcare",
    description:
      "Affirming healthcare for LGBTQ+ patients including primary care, gender-affirming care, and mental health services.",
    contact: {
      phone: "(843) 792-1414",
      website: "https://muschealth.org/",
    },
    location: {
      address: "169 Ashley Ave",
      city: "Charleston",
      state: "SC",
      zip: "29425",
    },
    hours: "Mon–Fri 8am–5pm",
    isEmergency: false,
    isVerified: true,
    isFeatured: false,
    showOnUIP: true,
    tags: ["healthcare", "gender-affirming", "primary care", "mental health"],
  },
  {
    _id: "seed-resource-crisis-line",
    _type: "resource",
    name: "Crisis Text Line",
    slug: { _type: "slug", current: "crisis-text-line" },
    category: "emergency",
    description:
      "Free, 24/7 mental health support via text. Text HOME to 741741 to connect with a trained crisis counselor.",
    contact: {
      website: "https://www.crisistextline.org/",
    },
    location: {
      isVirtual: true,
      serviceArea: "National",
    },
    hours: "24/7",
    isEmergency: true,
    isVerified: true,
    isFeatured: false,
    showOnUIP: true,
    tags: ["crisis", "mental health", "24/7", "text"],
  },
];

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------
const organizations = [
  {
    _id: "seed-org-affa-sc",
    _type: "organization",
    name: "Alliance for Full Acceptance",
    slug: { _type: "slug", current: "alliance-for-full-acceptance" },
    description: "South Carolina's oldest LGBTQ advocacy organization.",
    website: "https://www.affa-sc.org/",
    instagram: "affasc",
    isFeatured: true,
  },
  {
    _id: "seed-org-waf",
    _type: "organization",
    name: "We Are Family",
    slug: { _type: "slug", current: "we-are-family" },
    description: "Provides life-affirming and life-saving programs for LGBTQ+ young people that have a lasting and measurable impact, with a focus on those who are BIPOC and/or low-income.",
    website: "https://waf.org/",
    isFeatured: true,
  },
  {
    _id: "seed-org-charleston-black-pride",
    _type: "organization",
    name: "Charleston Black Pride",
    slug: { _type: "slug", current: "charleston-black-pride" },
    description: "Celebrating and uplifting the Black LGBTQ+ community of the Lowcountry.",
    website: "https://www.charlestonblackpride.org/",
    isFeatured: false,
  },
  {
    _id: "seed-org-park-circle-pride",
    _type: "organization",
    name: "Park Circle Pride",
    slug: { _type: "slug", current: "park-circle-pride" },
    description: "Building an inclusive and welcoming community in North Charleston's Park Circle neighborhood.",
    website: "https://www.parkcirclepride.com/",
    isFeatured: false,
  },
];

// ---------------------------------------------------------------------------
// Upsert all documents
// ---------------------------------------------------------------------------
async function seed() {
  const all = [...events, ...resources, ...organizations];
  console.log(`Seeding ${all.length} documents to dataset "${DATASET}"...`);

  const tx = client.transaction();
  for (const doc of all) {
    tx.createOrReplace(doc);
  }

  try {
    const result = await tx.commit();
    console.log(`Done. ${result.results.length} documents written.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
