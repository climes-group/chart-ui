import { searchAddress } from "@/utils/geocode";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { EraserIcon, LocateFixedIcon, SearchIcon } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

function ChooseLocation(props) {
  const [fieldAddress, setFieldAddress] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  async function handleSearchClick() {
    if (!fieldAddress) return;
    const resp = await searchAddress(fieldAddress);
    setSearchResults(resp?.items || []);
  }

  async function handleClearClick() {
    setFieldAddress("");
    setSearchResults(null);
  }

  const handleAddressSelect = (item) => {
    props.onChooseAddr(item);
    setFieldAddress(item.address.label);
    setSearchResults(null);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Stack spacing={2}>
        <TextField
          id="address-search"
          label="Search for an address"
          variant="outlined"
          value={fieldAddress}
          onChange={(e) => setFieldAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {fieldAddress && (
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClearClick}
                  >
                    <EraserIcon />
                  </IconButton>
                )}
                <IconButton aria-label="search" onClick={handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {searchResults && (
          <Paper elevation={3}>
            {searchResults.length > 0 ? (
              <List>
                {searchResults.slice(0, 10).map((item) => (
                  <ListItemButton
                    key={item.id}
                    onClick={() => handleAddressSelect(item)}
                  >
                    <ListItemText primary={item.address.label} />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography sx={{ p: 2 }}>No results found.</Typography>
            )}
          </Paper>
        )}

        <Divider>
          <p>OR</p>
        </Divider>

        <Button
          variant="outlined"
          onClick={props.onUseLocSvc}
          startIcon={<LocateFixedIcon />}
          fullWidth
        >
          Use my current location
        </Button>
      </Stack>
    </Box>
  );
}

ChooseLocation.propTypes = {
  onChooseAddr: PropTypes.func,
  onUseLocSvc: PropTypes.func,
};

export default ChooseLocation;
