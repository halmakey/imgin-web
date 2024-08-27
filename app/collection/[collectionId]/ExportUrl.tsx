import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useRef, useState } from "react";

const EXPORT_URL = process.env.NEXT_PUBLIC_EXPORT_URL || "";

export default function ExportUrl({ exportId }: { exportId: string }) {
  const url = `${EXPORT_URL}/export/${exportId}/video`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    inputRef.current?.select();
    navigator.clipboard.writeText(url);
    setCopied(true);
  }, [url]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="relative flex items-center p-2 pr-4" onClick={handleCopy}>
      <input
        ref={inputRef}
        type="text"
        className="bg-transparent p-2 outline-none"
        readOnly
        value={url}
      />
      <button type="button" className="absolute right-0">
        {copied ? (
          <CheckIcon className="size-4 text-green-500" />
        ) : (
          <ClipboardDocumentIcon className="size-4" />
        )}
      </button>
    </div>
  );
}
