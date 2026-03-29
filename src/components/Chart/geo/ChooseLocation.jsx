import { Button } from "@/components/ui/button";
import { searchAddress } from "@/utils/geocode";
import { EraserIcon, LocateFixedIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

function ChooseLocation({ onChooseAddr, onUseLocSvc }) {
  const [fieldAddress, setFieldAddress] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  async function handleSearchClick() {
    if (!fieldAddress) return;
    const resp = await searchAddress(fieldAddress);
    setSearchResults(resp?.items || []);
  }

  function handleClearClick() {
    setFieldAddress("");
    setSearchResults(null);
  }

  function handleAddressSelect(item) {
    onChooseAddr(item);
    setFieldAddress(item.address.label);
    setSearchResults(null);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Search input */}
      <div className="relative flex items-center">
        <input
          id="address-search"
          type="text"
          placeholder="Search for an address…"
          value={fieldAddress}
          onChange={(e) => setFieldAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
          className="w-full h-10 rounded-md border border-input bg-background px-3 pr-20 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <div className="absolute right-1 flex items-center gap-0.5">
          {fieldAddress && (
            <button
              type="button"
              onClick={handleClearClick}
              aria-label="Clear search"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <EraserIcon className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleSearchClick}
            aria-label="Search"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
          >
            <SearchIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* Search results */}
      {searchResults && (
        <div className="rounded-lg border border-golden-accent/40 bg-background overflow-hidden">
          {searchResults.length > 0 ? (
            <ul className="divide-y divide-golden-accent/20">
              {searchResults.slice(0, 10).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleAddressSelect(item)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-warm-gold/15 transition-colors"
                  >
                    {item.address.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="body-muted p-4 text-center">No results found.</p>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <span className="flex-1 h-px bg-warm-gold/40" aria-hidden />
        <span className="heading-label">Or</span>
        <span className="flex-1 h-px bg-warm-gold/40" aria-hidden />
      </div>

      {/* Device location */}
      <Button
        variant="outline"
        onClick={onUseLocSvc}
        className="w-full sm:w-auto sm:self-start"
      >
        <LocateFixedIcon className="size-4" />
        Use my location
      </Button>
    </div>
  );
}

export default ChooseLocation;
