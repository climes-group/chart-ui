import MapView from "@/components/Map/MapView";
import { useTranslation } from "@/i18n";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { GeoCode, lookUpHumanAddress, searchAddress } from "@/utils/geocode";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { LocateFixedIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ─── Debounced address search ─────────────────────────────────────────────────
// Fires after the user stops typing for `delay` ms.
// Requires at least 3 characters to avoid hammering Nominatim.
function useAddressSearch(delay = 380) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  // TODO: this should be handled in a re-useable place
  const lang = useTranslation().locale === "fr-CA" ? "fr" : "en";

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
function ProjectAddressAutocomplete({ field, form, dispatch, onLocate }) {
  const { setQuery, options, loading } = useAddressSearch();
  const { t } = useTranslation();

  function handleInputChange(_, newVal, reason) {
    field.handleChange(newVal);
    if (reason === "input") {
      setQuery(newVal);
      // Clear stale geo when the user edits the address manually
      dispatch(setGeoData(undefined));
      dispatch(setHumanAddress(undefined));
    }
  }

  function handleSelect(_, item) {
    if (!item || typeof item === "string") return;

    // Use the parsed street line; fall back to the full display label
    const streetLine = item.address.street || item.address.label;
    console.log("Selected address:", streetLine);
    field.handleChange(streetLine);

    if (item.address.city)
      form.setFieldValue("municipality", item.address.city);
    if (item.address.postcode)
      form.setFieldValue("postal_code", item.address.postcode);

    // Populate geo data from the Nominatim response
    if (item.position) {
      dispatch(setGeoData(item.position));
      dispatch(setHumanAddress(item.address.label));
    }

    // Clear error state on all three address fields so validation UI resets
    // immediately without the user needing to blur each field manually.
    const clearMeta = (prev) => ({
      ...prev,
      isTouched: false,
      errors: [],
      errorMap: {},
    });
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
        typeof opt === "string" ? opt : opt.address.street
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
          label={t("intake.fields.projectAddress")}
          required
          variant="outlined"
          fullWidth
          onBlur={field.handleBlur}
          error={field.state.meta.isTouched && !!field.state.meta.errors.length}
          helperText={
            field.state.meta.isTouched
              ? field.state.meta.errors[0]
              : t("intake.fields.projectAddressHelp")
          }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress
                    color="inherit"
                    size={16}
                    sx={{ mr: 0.5 }}
                  />
                ) : null}
                <Tooltip title={t("intake.fields.useMyLocation")}>
                  <IconButton
                    size="small"
                    onClick={onLocate}
                    aria-label={t("intake.fields.useMyLocation")}
                    sx={{ mr: -0.5 }}
                  >
                    <LocateFixedIcon className="size-4" />
                  </IconButton>
                </Tooltip>
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

// ─── Inline map preview ──────────────────────────────────────────────────────
function SiteLocationPreview({ geoData, humanAddress, onClear }) {
  const { t } = useTranslation();
  const geoCode = new GeoCode(geoData.lat, geoData.lng);
  return (
    <div className="space-y-3 pt-2">
      <div className="border-golden-accent/40 bg-background flex items-center justify-between gap-4 rounded-lg border p-3">
        <div className="min-w-0">
          <p className="text-muted-foreground mb-0.5 text-xs">
            {t("intake.fields.siteLocation")}
          </p>
          <p className="text-foreground truncate text-sm font-medium">
            {humanAddress || "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-warm-brown font-mono text-xs whitespace-nowrap">
            {geoCode.str}
          </p>
          <button
            type="button"
            onClick={onClear}
            aria-label={t("intake.fields.clearSiteLocation")}
            className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="border-border overflow-hidden rounded-lg border">
        <MapView geoData={geoData} compact />
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ProjectInformationSection({ form }) {
  const dispatch = useDispatch();
  const geoData = useSelector((s) => s.geo.geoData);
  const humanAddress = useSelector((s) => s.geo.humanAddress);
  const { t } = useTranslation();
  const required = t("validators.required");

  function handleUseDeviceLocation() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { coords } = pos;
      const geoCode = new GeoCode(coords.latitude, coords.longitude);
      dispatch(setGeoData(geoCode.obj));

      const deviceLoc = await lookUpHumanAddress(geoCode);
      const { address } = deviceLoc || {};
      console.log("Device location address:", deviceLoc);
      dispatch(setHumanAddress(deviceLoc.display_name || "Current Location"));

      // Fill the project address field so the user doesn't have to type it
      if (address.road) {
        form.setFieldValue(
          "project_address",
          `${address.house_number} ${address.road}`,
        );
      }

      form.setFieldValue("municipality", address.city ?? "");
      form.setFieldValue("postal_code", address.postcode ?? "");
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field name="building_permit">
          {(field) => (
            <TextField
              label={t("intake.fields.buildingPermit")}
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              helperText={t("intake.fields.buildingPermitHelp")}
            />
          )}
        </form.Field>

        {/* Address typeahead — spans full width so the dropdown has room */}
        <form.Field
          name="project_address"
          validators={{
            onBlur: ({ value }) => (!value ? required : undefined),
          }}
        >
          {(field) => (
            <div className="md:col-span-2">
              <ProjectAddressAutocomplete
                field={field}
                form={form}
                dispatch={dispatch}
                onLocate={handleUseDeviceLocation}
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="municipality"
          validators={{
            onBlur: ({ value }) => (!value ? required : undefined),
          }}
        >
          {(field) => (
            <TextField
              label={t("intake.fields.municipality")}
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
                ? t("validators.postalFormat")
                : undefined,
          }}
        >
          {(field) => (
            <TextField
              label={t("intake.fields.postalCode")}
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
                  : t("intake.fields.postalCodeHelp")
              }
            />
          )}
        </form.Field>

        {/* Inline map — expands when geo data is available */}
        <div className="md:col-span-2">
          <div className="expand-in" data-expanded={!!geoData || undefined}>
            <div>
              {geoData && (
                <SiteLocationPreview
                  geoData={geoData}
                  humanAddress={humanAddress}
                  onClear={() => {
                    dispatch(setGeoData(undefined));
                    dispatch(setHumanAddress(undefined));
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <form.Field name="pid_legal">
          {(field) => (
            <TextField
              label={t("intake.fields.pidLegal")}
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
            onBlur: ({ value }) => (!value ? required : undefined),
          }}
        >
          {(field) => (
            <TextField
              select
              label={t("intake.fields.unitModelType")}
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
            onBlur: ({ value }) =>
              value < 1 ? t("validators.minOne") : undefined,
          }}
        >
          {(field) => (
            <TextField
              type="number"
              label={t("intake.fields.primaryUnits")}
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
              label={t("intake.fields.secondarySuites")}
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
              label={t("intake.fields.planDate")}
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
              label={t("intake.fields.planAuthor")}
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
              label={t("intake.fields.planVersion")}
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
      <div className="border-border border-t pt-4">
        <form.Field name="modelling_standard">
          {(field) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                {t("intake.fields.modellingStandard")}
              </FormLabel>
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
                    label={t("intake.fields.modellingStandardOther")}
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
