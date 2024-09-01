import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useRef, useState } from "react";

const EXPORT_URL = process.env.NEXT_PUBLIC_EXPORT_URL || "";

export default function ExportUrl({
  exportId,
  suffix,
}: {
  exportId: string;
  suffix?: string;
}) {
  const url = `${EXPORT_URL}/export/${exportId}${suffix || ""}`;
  const divRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    if (!divRef.current) {
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(divRef.current);

    const selection = getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    navigator.clipboard.writeText(url);
    setCopied(true);
  }, [url]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="relative flex items-center gap-2 pr-4" onClick={handleCopy}>
      <div ref={divRef} className="break-all rounded border bg-transparent p-2">
        {url}
      </div>
      <button type="button" className="right-0">
        {copied ? (
          <CheckIcon className="size-6 text-green-500" />
        ) : (
          <ClipboardDocumentIcon className="size-6" />
        )}
      </button>
    </div>
  );
}
