import { Clear, Search, WrongLocation } from "@mui/icons-material";
import {
  Button,
  Container,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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
    setSearchResults(resp?.items);
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
      <Grid
        container
        spacing={1}
        sx={{ marginBottom: "2rem" }}
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid
          size={{ xs: 12, md: 7 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            id="filled-basic"
            label="Address"
            variant="filled"
            fullWidth
            value={fieldAddress}
            onChange={(e) => {
              console.log(e.target.value);
              setFieldAddress(e.target.value);
            }}
            sx={{}}
          />
        </Grid>

        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={handleSearchClick}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={handleClearClick}
        >
          Clear
        </Button>
      </Grid>
      {searchResults?.length && (
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableBody>
              {searchResults.slice(0, 10).map((row, ind) => {
                return (
                  <TableRow
                    key={row.formatted_address}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      title={row.address.label}
                    >
                      {
                        // get first 10 characters of the address
                        row.title.slice(0, 30)
                      }
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
