"use client";

import { useEffect, useState } from "react";

export default function SafeHTML({ html }: { html: string }) {
  const [safeHTML, setSafeHTML] = useState("");

  useEffect(() => {
    async function run() {
      const DOMPurify = (await import("dompurify")).default;
      setSafeHTML(DOMPurify.sanitize(html));
    }
    run();
  }, [html]);

  return <div dangerouslySetInnerHTML={{ __html: safeHTML }} />;
}
