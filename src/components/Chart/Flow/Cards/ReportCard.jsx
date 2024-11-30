import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import {
  downloadCsv,
  generateCsvFomJson,
} from "../../../../utils/generateReport";

export default function ReportCard(props) {
  const geoData = useSelector((s) => s.geo.geoData);
  const humanAddress = useSelector((s) => s.geo.humanAddress);

  return (
    <>
      <Typography variant="h6" textAlign={"left"}>
        Download reports
      </Typography>
      <p>
        <button
          onClick={() => {
            const csvRaw = generateCsvFomJson([
              "Site location details",
              { geoData, humanAddress },
            ]);
            downloadCsv(csvRaw, "site_location_details.csv");
          }}
        >
          Download site location details
        </button>
      </p>
      ;
    </>
  );
}
