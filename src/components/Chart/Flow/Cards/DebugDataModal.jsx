import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Check, Copy, X } from "lucide-react";
import { useState } from "react";

export default function DebugDataModal({ data, onClose }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy debug JSON:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Debug data"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <Card className="relative z-10 mx-4 w-full max-w-3xl border-2 border-warm-gold/60 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bug className="size-5 text-warm-brown" />
            <CardTitle className="heading-section">Debug data</CardTitle>
            <span className="rounded-full bg-warm-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warm-brown">
              Debug
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <pre className="max-h-[60vh] overflow-auto rounded-md border border-warm-gold/30 bg-warm-gold/5 p-3 text-xs font-mono text-charcoal whitespace-pre-wrap break-all">
            {json}
          </pre>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check />
                  Copied!
                </>
              ) : (
                <>
                  <Copy />
                  Copy JSON
                </>
              )}
            </Button>
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
