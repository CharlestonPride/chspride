"use client";

import { useEffect, useState } from "react";

// Matches Bootstrap's md breakpoint (768px). Below this, iframes are replaced
// with new-tab links to avoid double-scroll on mobile.
const MD_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MD_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
