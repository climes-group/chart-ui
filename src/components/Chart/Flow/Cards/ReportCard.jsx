import {
  setReportData,
  setReportGenAt,
  setReportGenTime,
  setReportStatus,
} from "@/state/slices/reportReducer";
import { downloadCsv, generateCsvFomJson } from "@/utils/generateReport";
import { Button } from "@mui/material";
import { Download, DownloadCloud, TrashIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function ReportCard() {
  const geoData = useSelector((s) => s.geo.geoData);
  const humanAddress = useSelector((s) => s.geo.humanAddress);
  const selectedSystems = useSelector((state) => state.report.selectedSystems);
  const { reportStatus, reportGenAt, reportGenTime } = useSelector(
    (s) => s.report,
  );
  const dispatch = useDispatch();

  function handleDownloadReport() {
    const csvRaw = generateCsvFomJson([{ geoData, humanAddress }]);
    downloadCsv(csvRaw, "site_location_details.csv");
  }

  async function handleGenerateReport() {
    // Placeholder for report generation logic
    console.log("Generating report...");
    dispatch(setReportStatus("generating"));
    const startTime = Date.now();

    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_HOST}/fault-tree-analysis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lat: geoData.lat,
            lng: geoData.lng,
            systems: selectedSystems ? Array.from(selectedSystems) : [],
          }),
        },
      );
      const responseData = await result.json();
      dispatch(setReportGenAt(new Date().toLocaleTimeString()));
      dispatch(setReportGenTime(Date.now() - startTime));
      dispatch(setReportData(responseData));
    } catch (error) {
      console.error("Error generating report:", error);
      dispatch(setReportStatus("error"));
      return;
    }
  }

  function handleClearReport() {
    dispatch(setReportStatus("not_generated"));
    dispatch(setReportGenAt(null));
    dispatch(setReportGenTime(null));
    dispatch(setReportData(null));
  }

  return (
    <>
      <h2 className="heading-card mb-1">Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-4">
          <h3 className="heading-section">Ready to generate</h3>
          <div className="flex gap-4">
            <Button
              onClick={handleGenerateReport}
              disabled={reportStatus === "generated"}
              variant="contained"
              size="sm"
            >
              Generate
            </Button>

            <Button
              onClick={handleClearReport}
              variant="outlined"
              size="sm"
              disabled={!(reportStatus === "generated")}
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="pl-0 md:pl-4 ">
          {reportStatus === "not_generated" && (
            <p className="body-muted">No report generated yet.</p>
          )}
          {reportStatus === "generating" && (
            <p className="body-muted">Generating report...</p>
          )}
          {reportStatus === "generated" && (
            <div className="flex flex-col space-y-6 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="heading-section flex justify-between items-center">
                Report{" "}
                <TrashIcon
                  className="hover:text-golden-accent cursor-pointer"
                  onClick={handleClearReport}
                />
              </h3>
              <div className="text-sm text-foreground space-y-1">
                <p>Status: {reportStatus} (mock)</p>
                {reportGenAt && <p>Generated at: {reportGenAt}</p>}
                {reportGenTime && (
                  <p>Generate time: {(reportGenTime / 1000).toFixed(2)}s</p>
                )}
              </div>
              <div className="flex gap-6 justify-evenly">
                <div>
                  <h4 className="heading-label mb-2">Download</h4>
                  <p>
                    <Button
                      onClick={handleDownloadReport}
                      variant="outlined"
                      size="sm"
                      startIcon={<Download />}
                    >
                      CSV
                    </Button>
                  </p>
                </div>

                <div className="flex flex-col">
                  <h4 className="heading-label mb-2">Save to Cloud</h4>
                  <p>
                    <Button
                      disabled
                      onClick={handleDownloadReport}
                      variant="outlined"
                      size="sm"
                      startIcon={<DownloadCloud />}
                    >
                      TBD
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
