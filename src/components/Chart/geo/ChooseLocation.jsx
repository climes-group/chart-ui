import {
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import { useState } from "react";
import useMedia from "../../../hooks/useMedia";
import { searchAddress } from "../../../utils/geocode";

function ChooseLocation(props) {
  const [fieldAddress, setFieldAddress] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [isSmallDevice] = useMedia();

  async function handleSearchClick() {
    const resp = await searchAddress(fieldAddress);
    console.log(resp);
    setSearchResults(resp?.items);
  }

  async function handleClearClick() {
    console.log("Clearing search results");
    setFieldAddress("");
    setSearchResults(null);
  }

  const containerSx = isSmallDevice
    ? {
        marginTop: "1rem",
        marginBottom: "1rem",
        padding: "0rem",
      }
    : {
        marginTop: "2rem",
        marginBottom: "2rem",
      };

  return (
    <Container sx={containerSx} maxWidth="xl">
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

        <Button variant="contained" onClick={handleSearchClick}>
          Search
        </Button>

        <Button variant="outlined" onClick={handleClearClick}>
          Clear
        </Button>
      </Grid>
      {searchResults?.length && (
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableBody>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {searchResults.slice(0, 10).map((row, ind) => {
                  return (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <FormControlLabel
                          value={ind}
                          control={<Radio />}
                          label={row.address.label}
                          onClick={() => {
                            props.onChooseAddr(searchResults[ind]);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </RadioGroup>
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
        <Button variant="contained" onClick={props.onUseLocSvc}>
          Use my location
        </Button>
      </Stack>
    </Container>
  );
}

ChooseLocation.propTypes = {
  onChooseAddr: PropTypes.func,
  onUseLocSvc: PropTypes.func,
};

export default ChooseLocation;
