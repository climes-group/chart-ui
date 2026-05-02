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
  AlertTriangle,
  Bug,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  MapPin,
  Pencil,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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

function ReportContext({
  humanAddress,
  intakeForm,
  systemCount,
  featureCount,
}) {
  const standards = (intakeForm?.modelling_standard || []).filter(Boolean);
  const standardsLabel = standards
    .map((s) =>
      s === "Other" && intakeForm?.modelling_standard_other
        ? intakeForm.modelling_standard_other
        : s,
    )
    .join(", ");

  const energy = [
    { label: "MEUI", value: intakeForm?.meui },
    { label: "TEDI", value: intakeForm?.tedi },
    { label: "GHGI", value: intakeForm?.ghgi },
  ].filter(
    (x) => x.value !== "" && x.value !== null && x.value !== undefined,
  );

  const hasLocation = !!humanAddress;
  const systemLine = [
    `${systemCount} system${systemCount !== 1 ? "s" : ""}`,
    `${featureCount} site feature${featureCount !== 1 ? "s" : ""}`,
    standardsLabel || null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div className="border-warm-gold/40 bg-warm-gold/10 space-y-3 rounded-lg border p-4">
      <div className="flex items-start gap-2.5 text-sm">
        {hasLocation ? (
          <MapPin className="text-primary mt-0.5 size-4 shrink-0" />
        ) : (
          <AlertTriangle className="text-warm-brown mt-0.5 size-4 shrink-0" />
        )}
        <div className="flex-1 space-y-1">
          {hasLocation ? (
            <p className="text-foreground">{humanAddress}</p>
          ) : (
            <p className="text-warm-brown">
              No location set — generation may fail
            </p>
          )}
          {systemLine && (
            <p className="text-muted-foreground text-xs">{systemLine}</p>
          )}
          {energy.length > 0 && (
            <p className="text-muted-foreground font-mono text-xs">
              {energy.map((e) => `${e.label} ${e.value}`).join("  ·  ")}
            </p>
          )}
        </div>
      </div>
      <div className="border-warm-gold/30 flex justify-end border-t pt-2.5">
        <Link
          to="/flow/summary"
          className="text-muted-foreground hover:text-teal-deep flex items-center gap-1 text-xs transition-colors"
        >
          <Pencil className="size-3" />
          Edit the summary
        </Link>
      </div>
    </div>
  );
}

export default function ReportCard() {
  const geoData = useSelector((s) => s.geo.geoData);
  const humanAddress = useSelector((s) => s.geo.humanAddress);
  const selectedSystems = useSelector((state) => state.report.selectedSystems);
  const selectedSiteFeatures = useSelector(
    (state) => state.report.selectedSiteFeatures,
  );
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
  const featureCount = selectedSiteFeatures?.length ?? 0;

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
              Generate a PDF report for the inputs reviewed on the previous
              step.
            </p>

            <ReportContext
              humanAddress={humanAddress}
              intakeForm={intakeForm}
              systemCount={systemCount}
              featureCount={featureCount}
            />
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
