import { searchAddress } from "@/utils/geocode";
import {
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
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
    <div className="flex flex-col gap-5">
      <TextField
        id="address-search"
        label="Search for an address"
        variant="outlined"
        size="small"
        fullWidth
        value={fieldAddress}
        onChange={(e) => setFieldAddress(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
        className="bg-background"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {fieldAddress && (
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearClick}
                  size="small"
                >
                  <EraserIcon className="h-4 w-4" />
                </IconButton>
              )}
              <IconButton
                aria-label="search"
                onClick={handleSearchClick}
                size="small"
              >
                <SearchIcon className="h-4 w-4" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {searchResults && (
        <div className="rounded-lg border border-border bg-background overflow-hidden">
          {searchResults.length > 0 ? (
            <List disablePadding dense>
              {searchResults.slice(0, 10).map((item) => (
                <ListItemButton
                  key={item.id}
                  onClick={() => handleAddressSelect(item)}
                  className="text-sm hover:bg-muted/50"
                >
                  <ListItemText
                    primary={item.address.label}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography
              variant="body2"
              className="p-4 text-muted-foreground text-center"
            >
              No results found.
            </Typography>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="flex-1 h-px bg-border" aria-hidden />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Or
        </span>
        <span className="flex-1 h-px bg-border" aria-hidden />
      </div>

      <Button
        variant="outlined"
        color="primary"
        size="medium"
        onClick={props.onUseLocSvc}
        startIcon={<LocateFixedIcon className="h-4 w-4" />}
        className="w-full sm:w-auto sm:self-start"
      >
        Use my location
      </Button>
    </div>
  );
}

ChooseLocation.propTypes = {
  onChooseAddr: PropTypes.func,
  onUseLocSvc: PropTypes.func,
};

export default ChooseLocation;
