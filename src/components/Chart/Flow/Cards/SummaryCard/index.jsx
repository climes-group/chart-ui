import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { formatLatLong } from "./utils";

function SummaryCard() {
  // Get selectedSystems from report slice
  const selectedSystems = useSelector((state) => state.report.selectedSystems);
  // Get selected site from geoReducer
  const { geoData, humanAddress } = useSelector((state) => state.geo);

  const intakeForm = useSelector((state) => state.report.intakeForm);

  // Convert Set to Array for display
  const selectedArray = Array.from(selectedSystems || []);

  // Split each system string on hyphen
  const rows = selectedArray.map((system) => {
    const parts = system.split("-");
    return {
      service: parts[0] || "",
      classification: parts[1] || "",
      astmName: parts[2] || "",
      astmSystemName: parts[3] || "",
    };
  });

  return (
    <div>
      <h2 className="heading-card">Summary</h2>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h3 className="heading-section">Project Information</h3>
          <Link
            to="/flow/intake"
            aria-label="Edit Intake Information"
            title="Edit Intake Information"
            tabIndex={0}
            className="mb-2"
          >
            <Pencil size={16} />
          </Link>
        </div>
        {intakeForm && Object.keys(intakeForm).length > 0 ? (
          <p className="body-muted">TBD</p>
        ) : (
          <p className="body-muted">No project information entered.</p>
        )}
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h3 className="heading-section">Site Location</h3>
          <Link
            to="/flow/siteLocation"
            aria-label="Edit Site Location"
            title="Edit Site Location"
            tabIndex={0}
            className="mb-2"
          >
            <Pencil size={16} />
          </Link>
        </div>
        {humanAddress || geoData ? (
          <div className="flex flex-col space-y-1 p-3 rounded-lg bg-muted/50 border border-border">
            <div>
              <span className="font-semibold text-foreground">Address:</span>
              <span className="ml-2 text-foreground">
                {humanAddress || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-foreground">
                Coordinates:
              </span>
              <span className="ml-2 text-foreground">
                {formatLatLong(geoData?.lat, geoData?.lng)}
              </span>
            </div>
          </div>
        ) : (
          <p className="body-muted">No site selected.</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <h3 className="heading-section">Selected Systems</h3>
        <Link
          to="/flow/applicableSystems"
          aria-label="Edit Selected Systems"
          title="Edit Selected Systems"
          tabIndex={0}
          className="mb-2"
        >
          <Pencil size={16} />
        </Link>
      </div>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Classification</TableCell>
              <TableCell>ASTM.Name</TableCell>
              <TableCell>ASTM.System.Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No systems selected.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>{row.classification}</TableCell>
                  <TableCell>{row.astmName}</TableCell>
                  <TableCell>{row.astmSystemName}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SummaryCard;
