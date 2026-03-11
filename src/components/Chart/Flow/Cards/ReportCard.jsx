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
  const { reportStatus, reportGenAt, reportGenTime } = useSelector(
    (s) => s.report,
  );
  const dispatch = useDispatch();

  function handleDownloadReport() {
    const csvRaw = generateCsvFomJson([{ geoData, humanAddress }]);
    downloadCsv(csvRaw, "site_location_details.csv");
  }

  function handleGenerateReport() {
    // Placeholder for report generation logic
    console.log("Generating report...");
    dispatch(setReportStatus("generating"));
    const startTime = Date.now();
    setTimeout(() => {
      console.log("Report generated!");
      dispatch(setReportGenAt(new Date().toLocaleTimeString()));
      dispatch(setReportGenTime(Date.now() - startTime));
      dispatch(setReportStatus("generated"));
    }, 2000);
  }

  function handleClearReport() {
    dispatch(setReportStatus("not_generated"));
    dispatch(setReportGenAt(null));
    dispatch(setReportGenTime(null));
    dispatch(setReportData(null));
  }

  return (
    <>
      <h2>Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-4">
          <h3>Ready to generate</h3>
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
          {reportStatus === "not_generated" && <p>No report generated yet.</p>}
          {reportStatus === "generating" && <p>Generating report...</p>}
          {reportStatus === "generated" && (
            <div className="flex flex-col space-y-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <h3 className="flex justify-between items-center  ">
                Report{" "}
                <TrashIcon
                  className="hover:text-golden-accent"
                  onClick={handleClearReport}
                />
              </h3>
              <p>
                <div>Status: {reportStatus} (mock)</div>
                {reportGenAt && <div>Generated at: {reportGenAt}</div>}
                {reportGenTime && (
                  <div>Generate time: {(reportGenTime / 1000).toFixed(2)}s</div>
                )}
              </p>
              <div className="flex gap-6 justify-evenly">
                <div>
                  <h4>Download</h4>
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
                  <h4>Save to Cloud</h4>
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
