import {
  setReportData,
  setReportGenAt,
  setReportGenTime,
  setReportStatus,
} from "@/state/slices/reportReducer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const openPdfInNewWindow = async (result) => {
  const byteCharacters = atob(result);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const fileURL = URL.createObjectURL(blob);
  const pdfWindow = window.open(fileURL, "_blank");

  if (!pdfWindow) {
    alert("Popup blocked! Please allow popups to view the report.");
  }
};

function PreflightItem({ label, detail, ok }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      {ok ? (
        <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-moss-primary" />
      ) : (
        <Circle className="size-4 shrink-0 mt-0.5 text-muted-foreground/35" />
      )}
      <div>
        <span className={ok ? "text-foreground" : "text-muted-foreground"}>
          {label}
        </span>
        {detail && (
          <span className="ml-1.5 text-xs text-muted-foreground">
            — {detail}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ReportCard() {
  const geoData = useSelector((s) => s.geo.geoData);
  const humanAddress = useSelector((s) => s.geo.humanAddress);
  const selectedSystems = useSelector((state) => state.report.selectedSystems);
  const intakeForm = useSelector((state) => state.report.intakeForm);
  const reportData = useSelector((state) => state.report.reportData);
  const { reportStatus, reportGenAt, reportGenTime } = useSelector(
    (s) => s.report,
  );
  const dispatch = useDispatch();

  async function handleGenerateReport() {
    dispatch(setReportStatus("generating"));
    const startTime = Date.now();

    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_HOST}/generate_report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            geo: { lat: geoData.lat, lon: geoData.lng },
            systems: selectedSystems ? Array.from(selectedSystems) : [],
            intakeForm: intakeForm ?? {},
          }),
        },
      );
      const responseData = await result.json();

      if (responseData.status === "Success") {
        dispatch(setReportGenAt(new Date().toLocaleTimeString()));
        dispatch(setReportGenTime(Date.now() - startTime));
        dispatch(setReportData(responseData.data));
        dispatch(setReportStatus("generated"));
      } else {
        dispatch(setReportStatus("error"));
      }
    } catch (error) {
      console.error("Error generating report:", error);
      dispatch(setReportStatus("error"));
    }
  }

  function handleClearReport() {
    dispatch(setReportStatus("not_generated"));
    dispatch(setReportGenAt(null));
    dispatch(setReportGenTime(null));
    dispatch(setReportData(null));
  }

  const isGenerating = reportStatus === "generating";
  const isGenerated = reportStatus === "generated";
  const isError = reportStatus === "error";

  const systemCount = selectedSystems?.length ?? 0;
  const hasIntake =
    !!intakeForm &&
    Object.values(intakeForm).some((v) =>
      Array.isArray(v) ? v.length > 0 : v !== "" && v !== 0,
    );

  return (
    <>
      <h2 className="heading-card mb-5">Report</h2>

      <div className="flex flex-col gap-5">
        {/* Primary action row */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerated || isGenerating}
            className="bg-moss-primary text-white hover:bg-moss-primary/90 disabled:opacity-60 px-5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <FileText />
                Generate Report
              </>
            )}
          </Button>

          {isGenerated && (
            <Button
              onClick={handleClearReport}
              variant="outline"
              className="text-muted-foreground"
            >
              <RefreshCw />
              Regenerate
            </Button>
          )}
        </div>

        {/* Status panel */}
        {reportStatus === "not_generated" && (
          <div className="space-y-4">
            <p className="body-muted">
              Generate a PDF report based on the selected systems and building location.
            </p>

            {/* Pre-flight checklist */}
            <div className="rounded-lg border border-warm-gold/40 bg-warm-gold/10 p-4 space-y-2.5">
              <p className="text-xs font-semibold text-warm-brown/70 uppercase tracking-wide mb-3">
                Checklist
              </p>
              <PreflightItem
                label="Site location selected"
                detail={humanAddress || null}
                ok={!!geoData}
              />
              <PreflightItem
                label="Systems selected"
                detail={
                  systemCount > 0
                    ? `${systemCount} system${systemCount !== 1 ? "s" : ""}`
                    : null
                }
                ok={systemCount > 0}
              />
              <PreflightItem
                label="Intake form filled"
                detail={intakeForm?.project_address || null}
                ok={hasIntake}
              />
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="size-4 shrink-0 animate-spin text-moss-primary" />
            <span>Building your report, this may take a moment…</span>
          </div>
        )}

        {isError && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-destructive">
                Report generation failed
              </p>
              <p className="body-muted">
                Please try again. If the issue persists, check your network
                connection.
              </p>
              <Button
                onClick={handleGenerateReport}
                variant="outline"
                size="sm"
                className="w-fit"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {isGenerated && (
          <div className="rounded-lg border border-moss-primary/20 bg-moss-primary/5 p-5 space-y-4">
            {/* Report header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 shrink-0 text-moss-primary" />
                <span className="text-sm font-semibold">Report ready</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {reportGenAt && <span>Generated at {reportGenAt}</span>}
                {reportGenTime && (
                  <span className="text-muted-foreground/60">
                    {(reportGenTime / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            </div>

            {/* Download action */}
            <div className="pt-3 border-t border-moss-primary/20">
              <Button
                onClick={() => openPdfInNewWindow(reportData)}
                className="bg-moss-primary text-white hover:bg-moss-primary/90 px-5"
              >
                <Download />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
