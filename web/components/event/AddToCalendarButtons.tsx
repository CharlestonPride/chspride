"use client";

function toCalDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
}

interface Props {
  name: string;
  startDateTime: string;
  endDateTime?: string;
  description?: string;
  location?: string;
}

export default function AddToCalendarButtons({ name, startDateTime, endDateTime, description, location }: Props) {
  const start = toCalDate(startDateTime);
  const end = endDateTime
    ? toCalDate(endDateTime)
    : toCalDate(new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString());

  const googleUrl = new URL("https://calendar.google.com/calendar/render");
  googleUrl.searchParams.set("action", "TEMPLATE");
  googleUrl.searchParams.set("text", name);
  googleUrl.searchParams.set("dates", `${start}/${end}`);
  if (description) googleUrl.searchParams.set("details", description);
  if (location) googleUrl.searchParams.set("location", location);

  function downloadICS() {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Charleston Pride//Web//EN",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${name}`,
      description ? `DESCRIPTION:${description.replace(/\n/g, "\\n")}` : null,
      location ? `LOCATION:${location}` : null,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      <a
        href={googleUrl.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-secondary btn-sm"
      >
        Add to Google Calendar
      </a>
      <button onClick={downloadICS} className="btn btn-outline-secondary btn-sm">
        Download .ics
      </button>
    </div>
  );
}
