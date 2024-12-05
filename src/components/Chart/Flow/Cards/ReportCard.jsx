import { Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import {
  downloadCsv,
  generateCsvFomJson,
} from "../../../../utils/generateReport";

export default function ReportCard() {
  const geoData = useSelector((s) => s.geo.geoData);
  const humanAddress = useSelector((s) => s.geo.humanAddress);

  return (
    <>
      <Typography variant="h6" textAlign={"left"}>
        Download reports
      </Typography>
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
