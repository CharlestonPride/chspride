const groq = String.raw;

// Upcoming events visible on UIP, featured first then chronological
export const uipEventsQuery = groq`
*[_type == "event" && showOnUIP == true && (
  (defined(endDateTime) && endDateTime >= now()) ||
  (!defined(endDateTime) && startDateTime >= now())
)] | order(isFeatured desc, startDateTime asc) [0...20] {
  _id,
  name,
  "slug": slug.current,
  description,
  "image": images[0],
  location,
  startDateTime,
  endDateTime,
  isFree,
  price,
  ageRestriction,
  ctaLabel,
  isFeatured,
  showOnCP,
  uipMoreInfoUrl,
  "hasTickets": defined(tickets.url)
}`;

export const uipEventSlugsQuery = groq`
*[_type == "event" && showOnUIP == true && defined(slug.current)] {
  "slug": slug.current
}`;

export const uipEventBySlugQuery = groq`
*[_type == "event" && slug.current == $slug && showOnUIP == true][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  content,
  images,
  location,
  startDateTime,
  endDateTime,
  isFree,
  price,
  ageRestriction,
  keywords,
  isFeatured,
  showOnCP,
  uipMoreInfoUrl,
  tickets {
    url,
    embedMode,
    openDateTime,
    closeDateTime,
    isSoldOut,
    soldOutMessage,
    unavailableMessage
  },
  registration {
    label,
    description,
    url,
    embedMode,
    openDateTime,
    closeDateTime,
    unavailableMessage
  }
}`;

// All resources visible on UIP, emergency + featured first
export const uipResourcesQuery = groq`
*[_type == "resource" && showOnUIP == true] | order(isEmergency desc, isFeatured desc, name asc) {
  _id,
  name,
  "slug": slug.current,
  logo,
  category,
  description,
  contact,
  location,
  hours,
  isEmergency,
  isFeatured,
  tags
}`;

export const uipResourceSlugsQuery = groq`
*[_type == "resource" && showOnUIP == true && defined(slug.current)] {
  "slug": slug.current
}`;

export const uipResourceBySlugQuery = groq`
*[_type == "resource" && slug.current == $slug && showOnUIP == true][0] {
  _id,
  name,
  "slug": slug.current,
  logo,
  category,
  description,
  content,
  contact,
  location,
  hours,
  isEmergency,
  isFeatured,
  isVerified,
  tags
}`;

// All organizations, featured first then alphabetical
export const uipOrganizationsQuery = groq`
*[_type == "organization"] | order(isFeatured desc, name asc) {
  _id,
  name,
  "slug": slug.current,
  logo,
  description,
  website,
  instagram,
  facebook,
  twitter,
  isFeatured
}`;

// Featured organizations only (for homepage)
export const uipFeaturedOrganizationsQuery = groq`
*[_type == "organization" && isFeatured == true] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  logo,
  description,
  website,
  instagram,
  facebook,
  twitter,
  isFeatured
}`;
