"use client";

import { useState, useMemo } from "react";
import ResourceCard, { type ResourceCardData } from "./ResourceCard";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "healthcare", label: "Healthcare" },
  { value: "mentalHealth", label: "Mental Health" },
  { value: "legal", label: "Legal Services" },
  { value: "supportGroup", label: "Support Groups" },
  { value: "youth", label: "Youth Services" },
  { value: "senior", label: "Senior Services" },
  { value: "housing", label: "Housing" },
  { value: "emergency", label: "Emergency" },
  { value: "business", label: "Businesses" },
  { value: "education", label: "Education" },
  { value: "spiritual", label: "Spiritual & Faith" },
  { value: "social", label: "Social & Recreation" },
];

export default function ResourceFilters({ resources }: { resources: ResourceCardData[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return resources.filter((r) => {
      if (category && r.category !== category) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [resources, search, category]);

  // Only show categories that have at least one resource
  const activeCats = useMemo(() => {
    const used = new Set(resources.map((r) => r.category));
    return CATEGORIES.filter((c) => c.value === "" || used.has(c.value));
  }, [resources]);

  return (
    <div>
      {/* Search + filter controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search resources…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg px-4 py-2 text-sm focus:outline-none"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg px-4 py-2 text-sm focus:outline-none"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            minWidth: "160px",
          }}
        >
          {activeCats.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs mb-4" style={{ color: "var(--color-muted)" }}>
        {filtered.length} {filtered.length === 1 ? "resource" : "resources"} found
      </p>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <ResourceCard key={r._id} resource={r} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16" style={{ color: "var(--color-muted)" }}>
          <p className="text-lg font-medium mb-1">No resources found</p>
          <p className="text-sm">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
