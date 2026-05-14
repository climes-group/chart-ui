import MapView from "@/components/Map/MapView";
import { useTranslation } from "@/i18n";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import type { RootState } from "@/state/store";
import {
  GeoCode,
  lookUpHumanAddress,
  searchAddress,
  type AddressResult,
} from "@/utils/geocode";
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
import type {
  AnyFieldApi,
  AnyFieldMetaBase,
  AnyFormState,
} from "@tanstack/form-core";
import { LocateFixedIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import type { IntakeFormApi } from ".";

const MODELLING_STANDARDS = ["EnerGuide", "Passive House", "CHBA Net-Zero", "Other"] as const;

function addOption(values: readonly string[], opt: string): string[] {
  return [...values, opt];
}

function removeOption(values: readonly string[], opt: string): string[] {
  return values.filter((v) => v !== opt);
}

// ─── Debounced address search ─────────────────────────────────────────────────
function useAddressSearch(delay = 380) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(async (q: string) => {
    setLoading(true);
    const resp = await searchAddress(q);
    setOptions(resp?.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.length < 3) {
      setOptions([]);
      return;
    }
    timer.current = setTimeout(() => run(query), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, delay, run]);

  return { query, setQuery, options, loading };
}

type AutocompleteProps = {
  field: AnyFieldApi;
  form: IntakeFormApi;
  dispatch: Dispatch;
  onLocate: () => void;
};

function ProjectAddressAutocomplete({
  field,
  form,
  dispatch,
  onLocate,
}: Readonly<AutocompleteProps>) {
  const { setQuery, options, loading } = useAddressSearch();
  const { t } = useTranslation();

  function handleInputChange(
    _: unknown,
    newVal: string,
    reason: string,
  ) {
    field.handleChange(newVal);
    if (reason === "input") {
      setQuery(newVal);
      dispatch(setGeoData(undefined));
      dispatch(setHumanAddress(undefined));
    }
  }

  function handleSelect(_: unknown, item: AddressResult | string | null) {
    if (!item || typeof item === "string") return;

    const streetLine = item.address.street || item.address.label;
    field.handleChange(streetLine);

    if (item.address.city)
      form.setFieldValue("municipality", item.address.city);
    if (item.address.postcode)
      form.setFieldValue("postal_code", item.address.postcode);

    if (item.position) {
      dispatch(setGeoData(item.position));
      dispatch(setHumanAddress(item.address.label));
    }

    const clearMeta = (prev: AnyFieldMetaBase) => ({
      ...prev,
      isTouched: false,
      errors: [],
      errorMap: {},
    });
    form.setFieldMeta("project_address", clearMeta);
    form.setFieldMeta("municipality", clearMeta);
    form.setFieldMeta("postal_code", clearMeta);

    setQuery("");
  }

  return (
    <Autocomplete<AddressResult, false, false, true>
      freeSolo
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
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & {
          key: string;
        };
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
          slotProps={{
            input: {
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
            },
          }}
        />
      )}
    />
  );
}

type SiteLocationPreviewProps = {
  geoData: { lat: number; lng: number };
  humanAddress?: string;
  onClear: () => void;
};

function SiteLocationPreview({
  geoData,
  humanAddress,
  onClear,
}: Readonly<SiteLocationPreviewProps>) {
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

type NominatimReverseResponse = {
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    postcode?: string;
  };
};

type Props = { form: IntakeFormApi };

export default function ProjectInformationSection({ form }: Readonly<Props>) {
  const dispatch = useDispatch();
  const geoData = useSelector((s: RootState) => s.geo.geoData);
  const humanAddress = useSelector((s: RootState) => s.geo.humanAddress);
  const { t } = useTranslation();
  const required = t("validators.required");

  function handleUseDeviceLocation() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { coords } = pos;
      const geoCode = new GeoCode(coords.latitude, coords.longitude);
      dispatch(setGeoData(geoCode.obj));

      const result = (await lookUpHumanAddress(
        geoCode,
      )) as NominatimReverseResponse | "";
      const deviceLoc = typeof result === "string" ? null : result;
      const address = deviceLoc?.address ?? {};
      dispatch(
        setHumanAddress(
          deviceLoc?.display_name || t("intake.fields.currentLocation"),
        ),
      );

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
          {(field: AnyFieldApi) => (
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

        <form.Field
          name="project_address"
          validators={{
            onBlur: ({ value }: { value: string }) =>
              value ? undefined : required,
          }}
        >
          {(field: AnyFieldApi) => (
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
            onBlur: ({ value }: { value: string }) =>
              value ? undefined : required,
          }}
        >
          {(field: AnyFieldApi) => (
            <TextField
              label={t("intake.fields.municipality")}
              fullWidth
              variant="outlined"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched &&
                !!field.state.meta.errors.length
              }
            />
          )}
        </form.Field>

        <form.Field
          name="postal_code"
          validators={{
            onBlur: ({ value }: { value: string }) =>
              /^[A-Z]\d[A-Z] \d[A-Z]\d$/i.test(value)
                ? undefined
                : t("validators.postalFormat"),
          }}
        >
          {(field: AnyFieldApi) => (
            <TextField
              label={t("intake.fields.postalCode")}
              fullWidth
              variant="outlined"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched &&
                !!field.state.meta.errors.length
              }
              helperText={
                field.state.meta.isTouched
                  ? field.state.meta.errors[0]
                  : t("intake.fields.postalCodeHelp")
              }
            />
          )}
        </form.Field>

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
          {(field: AnyFieldApi) => (
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
            onBlur: ({ value }: { value: string }) =>
              value ? undefined : required,
          }}
        >
          {(field: AnyFieldApi) => (
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
                field.state.meta.isTouched &&
                !!field.state.meta.errors.length
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
            onBlur: ({ value }: { value: number | string }) =>
              Number(value) < 1 ? t("validators.minOne") : undefined,
          }}
        >
          {(field: AnyFieldApi) => (
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
          {(field: AnyFieldApi) => (
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
          {(field: AnyFieldApi) => (
            <TextField
              type="date"
              label={t("intake.fields.planDate")}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="building_plan_author">
          {(field: AnyFieldApi) => (
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
          {(field: AnyFieldApi) => (
            <TextField
              label={t("intake.fields.planVersion")}
              fullWidth
              variant="outlined"
              placeholder={t("intake.fields.planVersionPlaceholder")}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>

      <div className="border-border border-t pt-4">
        <form.Field name="modelling_standard">
          {(field: AnyFieldApi) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                {t("intake.fields.modellingStandard")}
              </FormLabel>
              <FormGroup row>
                {MODELLING_STANDARDS.map((opt) => (
                  <FormControlLabel
                    key={opt}
                    control={
                      <Checkbox
                        checked={field.state.value.includes(opt)}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.checked ? addOption(field.state.value, opt) : removeOption(field.state.value, opt),
                          )
                        }
                      />
                    }
                    label={opt}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state: AnyFormState) =>
            ((state.values as Record<string, unknown>)
              .modelling_standard as string[]) ?? []
          }
        >
          {(standards: string[]) =>
            standards.includes("Other") && (
              <form.Field name="modelling_standard_other">
                {(field: AnyFieldApi) => (
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
