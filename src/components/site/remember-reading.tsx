"use client";

import { useEffect } from "react";

export function RememberReading({ slug, name, chapter }: { slug: string; name: string; chapter: number }) {
  useEffect(() => {
    window.localStorage.setItem(
      "pv_last_read",
      JSON.stringify({ slug, name, chapter, at: new Date().toISOString() }),
    );
  }, [slug, name, chapter]);

  return null;
}
