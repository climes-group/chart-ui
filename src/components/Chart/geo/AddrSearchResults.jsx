import { Clear, Search, WrongLocation } from "@mui/icons-material";
import {
  Button,
  Container,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { searchAddress } from "../../../utils/geocode";

export default function AddrSearchResults(props) {
  const [fieldAddress, setFieldAddress] = useState("");
  const [searchResults, setSearchResults] = useState();

  async function handleSearchClick() {
    console.log("searching", fieldAddress);
    const resp = await searchAddress(fieldAddress);
    console.log(resp);
    setSearchResults(resp?.results);
  }

  async function handleClearClick() {
    console.log("searching", fieldAddress);
    setFieldAddress("");
    setSearchResults(null);
  }

  async function handleUseClick(id) {
    return () => {
      props.handleAddrChoose(searchResults[id]);
    };
  }

  return (
    <Container sx={{ marginTop: "2rem", marginBottom: "2rem" }} maxWidth="xl">
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          paddingTop: "1em",
          flexWrap: "Wrap",
        }}
      >
        <TextField
          id="filled-basic"
          label="Address"
          variant="filled"
          value={fieldAddress}
          onChange={(e) => {
            console.log(e.target.value);
            setFieldAddress(e.target.value);
          }}
          sx={{ marginBottom: "2rem" }}
        />
        <Button
          sx={{ my: "2red" }}
          variant="contained"
          startIcon={<Search />}
          onClick={handleSearchClick}
        >
          Search
        </Button>
        <Button
          sx={{ my: "2red" }}
          variant="outlined"
          startIcon={<Clear />}
          onClick={handleClearClick}
        >
          Clear
        </Button>
      </Stack>
      {searchResults?.length && (
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              {searchResults.slice(0, 10).map((row, ind) => {
                return (
                  <TableRow
                    key={row.formatted_address}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.formatted_address}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => {
                          props.handleAddrChoose(searchResults[ind]);
                        }}
                      >
                        Use
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {searchResults && (
        <Typography>{`${searchResults?.length} result(s) found.`}</Typography>
      )}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          paddingTop: "1em",
        }}
      >
        <Typography>or</Typography>
        <Button variant="contained" onClick={props.onClickUseDeviceLocation}>
          Device location
        </Button>
        <div>
          {props?.hasAcceptedTerms ? (
            <Tooltip title="Enabled">
              <PublicIcon style={{ color: "#1976d2" }} />
            </Tooltip>
          ) : (
            <Tooltip title="Location services unavailable / permission not granted">
              <WrongLocation style={{ color: "rgb(226, 176, 70)" }} />
            </Tooltip>
          )}
        </div>
      </Stack>
    </Container>
  );
}
