import { downloadCsv, generateCsvFomJson } from "@/utils/generateReport";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

export default function ReportCard() {
  const geoData = useSelector((s) => s.geo.geoData);
  const humanAddress = useSelector((s) => s.geo.humanAddress);

  return (
    <>
      <h2>Download Reports</h2>
      <p>
        <Button
          onClick={() => {
            const csvRaw = generateCsvFomJson([{ geoData, humanAddress }]);
            downloadCsv(csvRaw, "site_location_details.csv");
          }}
        >
          Download site location details
        </Button>
      </p>
    </>
  );
}
