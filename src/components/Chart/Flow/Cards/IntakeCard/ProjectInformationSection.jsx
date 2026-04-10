import { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { searchAddress } from "@/utils/geocode";

// ─── Debounced address search ─────────────────────────────────────────────────
// Fires after the user stops typing for `delay` ms.
// Requires at least 3 characters to avoid hammering Nominatim.
function useAddressSearch(delay = 380) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const run = useCallback(async (q) => {
    setLoading(true);
    const resp = await searchAddress(q);
    setOptions(resp?.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(timer.current);
    if (query.length < 3) {
      setOptions([]);
      return;
    }
    timer.current = setTimeout(() => run(query), delay);
    return () => clearTimeout(timer.current);
  }, [query, delay, run]);

  return { query, setQuery, options, loading };
}

// ─── Autocomplete field ───────────────────────────────────────────────────────
// Keeps TanStack Form as the source of truth for project_address.
// On selection it also pushes city → municipality and postcode → postal_code.
function ProjectAddressAutocomplete({ field, form }) {
  const { setQuery, options, loading } = useAddressSearch();

  function handleInputChange(_, newVal, reason) {
    field.handleChange(newVal);
    if (reason === "input") setQuery(newVal);
  }

  function handleSelect(_, item) {
    if (!item || typeof item === "string") return;

    // Use the parsed street line; fall back to the full display label
    const streetLine = item.address.street || item.address.label;
    field.handleChange(streetLine);

    if (item.address.city)
      form.setFieldValue("municipality", item.address.city);
    if (item.address.postcode)
      form.setFieldValue("postal_code", item.address.postcode);

    // Clear error state on all three address fields so validation UI resets
    // immediately without the user needing to blur each field manually.
    const clearMeta = (prev) => ({ ...prev, isTouched: false, errors: [], errorMap: {} });
    form.setFieldMeta("project_address", clearMeta);
    form.setFieldMeta("municipality", clearMeta);
    form.setFieldMeta("postal_code", clearMeta);

    // Reset search suggestions once a pick is made
    setQuery("");
  }

  return (
    <Autocomplete
      freeSolo
      // Disable the built-in client filter — results come from the server
      filterOptions={(x) => x}
      options={options}
      getOptionLabel={(opt) =>
        typeof opt === "string" ? opt : opt.address.label
      }
      loading={loading}
      inputValue={field.state.value ?? ""}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      renderOption={(props, opt) => {
        // Destructure key to avoid React "key in props" warning
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest}>
            <span style={{ fontSize: "0.875rem", lineHeight: 1.4 }}>
              {opt.address.label}
            </span>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Project Address"
          required
          variant="outlined"
          fullWidth
          onBlur={field.handleBlur}
          error={field.state.meta.isTouched && !!field.state.meta.errors.length}
          helperText={
            field.state.meta.isTouched
              ? field.state.meta.errors[0]
              : "Start typing to search"
          }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={16} sx={{ mr: 0.5 }} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ProjectInformationSection({ form }) {
  return (
    <div className="space-y-4">
      <h3 className="heading-section">Project Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="building_permit">
          {(field) => (
            <TextField
              label="Building Permit #"
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              helperText="If applicable"
            />
          )}
        </form.Field>

        {/* Address typeahead — spans full width so the dropdown has room */}
        <form.Field
          name="project_address"
          validators={{
            onBlur: ({ value }) => (!value ? "Required" : undefined),
          }}
        >
          {(field) => (
            <div className="md:col-span-2">
              <ProjectAddressAutocomplete field={field} form={form} />
            </div>
          )}
        </form.Field>

        <form.Field
          name="municipality"
          validators={{
            onBlur: ({ value }) => (!value ? "Required" : undefined),
          }}
        >
          {(field) => (
            <TextField
              label="Municipality / District"
              fullWidth
              variant="outlined"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched && !!field.state.meta.errors.length
              }
            />
          )}
        </form.Field>

        <form.Field
          name="postal_code"
          validators={{
            onBlur: ({ value }) =>
              !/^[A-Z]\d[A-Z] \d[A-Z]\d$/i.test(value)
                ? "Format: A1A 1A1"
                : undefined,
          }}
        >
          {(field) => (
            <TextField
              label="Postal Code"
              fullWidth
              variant="outlined"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched && !!field.state.meta.errors.length
              }
              helperText={
                field.state.meta.isTouched
                  ? field.state.meta.errors[0]
                  : "A1A 1A1"
              }
            />
          )}
        </form.Field>

        <form.Field name="pid_legal">
          {(field) => (
            <TextField
              label="PID or Legal Description"
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field
          name="unit_model_type"
          validators={{
            onBlur: ({ value }) => (!value ? "Required" : undefined),
          }}
        >
          {(field) => (
            <TextField
              select
              label="Unit and Model Type"
              fullWidth
              variant="outlined"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched && !!field.state.meta.errors.length
              }
            >
              {[
                "Laneway House",
                "Single Detached",
                "Single Detached w/Secondary Suite",
                "Double/Semi-detached (non-MURB)",
                "Row House (non-MURB)",
                "Multi-plex (non-MURB)",
                "Low-Rise MURB",
                "Stacked Duplex (MURB)",
                "Triplex (MURB)",
              ].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          )}
        </form.Field>

        <form.Field
          name="total_primary_units"
          validators={{
            onBlur: ({ value }) => (value < 1 ? "Min 1" : undefined),
          }}
        >
          {(field) => (
            <TextField
              type="number"
              label="Primary Units"
              fullWidth
              variant="outlined"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="total_secondary_suites">
          {(field) => (
            <TextField
              type="number"
              label="Secondary Suites"
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="building_plan_date">
          {(field) => (
            <TextField
              type="date"
              label="Plan Date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="building_plan_author">
          {(field) => (
            <TextField
              label="Plan Author"
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="building_plan_version">
          {(field) => (
            <TextField
              label="Plan Version"
              fullWidth
              variant="outlined"
              placeholder="e.g. v1.0"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>

      {/* Modelling Standard */}
      <div className="border-t border-border pt-4">
        <form.Field name="modelling_standard">
          {(field) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">Modelling Standard</FormLabel>
              <FormGroup row>
                {["EnerGuide", "Passive House", "CHBA Net-Zero", "Other"].map(
                  (opt) => (
                    <FormControlLabel
                      key={opt}
                      control={
                        <Checkbox
                          checked={field.state.value.includes(opt)}
                          onChange={(e) => {
                            const nextValue = e.target.checked
                              ? [...field.state.value, opt]
                              : field.state.value.filter((v) => v !== opt);
                            field.handleChange(nextValue);
                          }}
                        />
                      }
                      label={opt}
                    />
                  ),
                )}
              </FormGroup>
            </FormControl>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.modelling_standard}>
          {(standards) =>
            standards.includes("Other") && (
              <form.Field name="modelling_standard_other">
                {(field) => (
                  <TextField
                    label="Specify Other Standard"
                    fullWidth
                    variant="outlined"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    sx={{ mt: 2, maxWidth: "50%" }}
                  />
                )}
              </form.Field>
            )
          }
        </form.Subscribe>
      </div>
    </div>
  );
}
