import { Button } from "@/components/ui/button";
import { useDebugMode } from "@/context/TestModeContext";
import {
  getSystemCodeFor,
  setReportData,
  setReportDebugData,
  setReportGenAt,
  setReportGenTime,
  setReportStatus,
} from "@/state/slices/reportReducer";
import {
  Bug,
  CheckCircle2,
  Circle,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DebugDataModal from "./DebugDataModal";

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
        <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
      ) : (
        <Circle className="text-muted-foreground/35 mt-0.5 size-4 shrink-0" />
      )}
      <div>
        <span className={ok ? "text-foreground" : "text-muted-foreground"}>
          {label}
        </span>
        {detail && (
          <span className="text-muted-foreground ml-1.5 text-xs">
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
  const reportDebugData = useSelector((state) => state.report.reportDebugData);
  const { reportStatus, reportGenAt, reportGenTime } = useSelector(
    (s) => s.report,
  );
  const token = useSelector((s) => s.user.token);
  const dispatch = useDispatch();
  const isDebugMode = useDebugMode();
  const [showDebug, setShowDebug] = useState(false);

  async function handleGenerateReport() {
    dispatch(setReportStatus("generating"));
    const startTime = Date.now();

    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_HOST}/generate_report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            geo: { lat: geoData.lat, lon: geoData.lng },
            systems: (selectedSystems ?? [])
              .map(getSystemCodeFor)
              .filter(Boolean),
            intakeForm: intakeForm ?? {},
            ...(isDebugMode && { debug: true }),
          }),
        },
      );
      const responseData = await result.json();

      if (responseData.status === "Success") {
        dispatch(setReportGenAt(new Date().toLocaleTimeString()));
        dispatch(setReportGenTime(Date.now() - startTime));
        dispatch(setReportData(responseData.data));
        dispatch(setReportDebugData(responseData.debugData ?? null));
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
    dispatch(setReportDebugData(null));
    setShowDebug(false);
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
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerated || isGenerating}
            className="px-5 disabled:opacity-60"
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
              Generate a PDF report based on the selected systems and building
              location.
            </p>

            {/* Pre-flight checklist */}
            <div className="border-warm-gold/40 bg-warm-gold/10 space-y-2.5 rounded-lg border p-4">
              <p className="text-warm-brown mb-3 text-xs font-semibold tracking-wide uppercase">
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
          <div className="border-border bg-muted/20 text-muted-foreground flex items-center gap-3 rounded-lg border px-4 py-3 text-sm">
            <Loader2 className="text-primary size-4 shrink-0 animate-spin" />
            <span>Building your report, this may take a moment…</span>
          </div>
        )}

        {isError && (
          <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-lg border p-4">
            <XCircle className="text-destructive mt-0.5 size-5 shrink-0" />
            <div className="flex flex-col gap-2">
              <p className="text-destructive text-sm font-medium">
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
          <div className="border-primary/20 bg-primary/5 space-y-4 rounded-lg border p-5">
            {/* Report header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary size-5 shrink-0" />
                <span className="text-sm font-semibold">Report ready</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-3 text-xs">
                {reportGenAt && <span>Generated at {reportGenAt}</span>}
                {reportGenTime && (
                  <span className="text-muted-foreground/60">
                    {(reportGenTime / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            </div>

            {/* Download action */}
            <div className="border-primary/20 flex flex-wrap items-center gap-3 border-t pt-3">
              <Button
                onClick={() => openPdfInNewWindow(reportData)}
                className="px-5"
              >
                <Download />
                Download PDF
              </Button>

              {isDebugMode && reportDebugData && (
                <Button
                  variant="link"
                  onClick={() => setShowDebug(true)}
                  className="text-warm-brown hover:text-warm-brown/80 decoration-warm-gold/60 underline decoration-dashed underline-offset-4"
                >
                  <Bug />
                  View debug data
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {showDebug && reportDebugData && (
        <DebugDataModal
          data={reportDebugData}
          onClose={() => setShowDebug(false)}
        />
      )}
    </>
  );
}
