import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";

export default function FinishCard({ onReset, onBackToReport }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const intake = useSelector((s) => s.report.intakeForm);
  const selectedSystems = useSelector((s) => s.report.selectedSystems);
  const reportGenAt = useSelector((s) => s.report.reportGenAt);

  const date = reportGenAt ? new Date(reportGenAt).toLocaleDateString() : null;
  const address = intake?.project_address?.trim() || "your project";
  const count = selectedSystems?.length ?? 0;

  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <CheckCircle2
        className="text-moss-primary mb-4 size-16"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h2 className="heading-card mb-3">All done!</h2>
      <p className="body-muted mb-2 max-w-md">
        Report generated for <strong>{address}</strong> with{" "}
        <strong>{count}</strong> system{count === 1 ? "" : "s"}
        {date ? ` on ${date}` : ""}.
      </p>
      {onBackToReport && (
        <button
          type="button"
          onClick={onBackToReport}
          className="text-primary mt-2 mb-8 text-sm underline"
        >
          ← Back to Report
        </button>
      )}

      {!confirmOpen ? (
        <Button
          onClick={() => setConfirmOpen(true)}
          variant="outline"
          className="mt-4"
        >
          Start a new report
        </Button>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-3">
          <p className="text-foreground text-sm">
            This will clear all your data. Continue?
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onReset}>
              Yes, start over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
