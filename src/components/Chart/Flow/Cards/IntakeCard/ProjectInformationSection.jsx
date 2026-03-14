import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  TextField,
} from "@mui/material";

const MODELLING_STANDARD_OPTIONS = [
  "EnerGuide",
  "Passive House",
  "CHBA Net-Zero",
  "Other",
];

export default function ProjectInformationSection({
  values,
  onChange,
  onModellingStandardChange,
}) {
  return (
    <div className="space-y-4">
      <h3 className="heading-section">Project Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Building Permit #"
          helperText="If Applicable"
          fullWidth
          size="small"
          className="mb-4"
          value={values.building_permit}
          onChange={onChange("building_permit")}
        />
        <TextField
          label="Project Address"
          required
          fullWidth
          size="small"
          className="mb-4"
          value={values.project_address}
          onChange={onChange("project_address")}
        />
        <TextField
          label="Municipality / District"
          required
          fullWidth
          size="small"
          className="mb-4"
          value={values.municipality}
          onChange={onChange("municipality")}
        />
        <TextField
          label="Postal Code"
          helperText="Canadian format: A1A 1A1"
          required
          fullWidth
          size="small"
          className="mb-4"
          value={values.postal_code}
          onChange={onChange("postal_code")}
        />
        <TextField
          label="PID or Legal Description"
          fullWidth
          size="small"
          className="mb-4"
          value={values.pid_legal}
          onChange={onChange("pid_legal")}
        />
        <TextField
          label="Unit and Model Type"
          required
          select
          fullWidth
          size="small"
          className="mb-4"
          value={values.unit_model_type}
          onChange={onChange("unit_model_type")}
          helperText="Dropdown menu"
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
        <TextField
          label="Total Primary Dwelling Units"
          type="number"
          helperText="Integer ≥ 1"
          required
          fullWidth
          size="small"
          className="mb-4"
          value={values.total_primary_units}
          onChange={onChange("total_primary_units")}
        />
        <TextField
          label="Total Secondary Suites"
          type="number"
          helperText="Integer ≥ 0"
          fullWidth
          size="small"
          className="mb-4"
          value={values.total_secondary_suites}
          onChange={onChange("total_secondary_suites")}
        />
        <TextField
          label="Building Plan Date"
          type="date"
          helperText="ISO 8601: YYYY-MM-DD"
          fullWidth
          size="small"
          className="mb-4"
          InputLabelProps={{ shrink: true }}
          value={values.building_plan_date}
          onChange={onChange("building_plan_date")}
        />
        <TextField
          label="Building Plan Author"
          fullWidth
          size="small"
          className="mb-4"
          value={values.building_plan_author}
          onChange={onChange("building_plan_author")}
        />
        <TextField
          label="Building Plan Version"
          helperText="e.g. v1.0, Rev A"
          fullWidth
          size="small"
          className="mb-4"
          value={values.building_plan_version}
          onChange={onChange("building_plan_version")}
        />

        <FormControl component="fieldset" className="mb-4">
          <FormLabel component="legend">Modelling Standard</FormLabel>
          <p className="text-xs text-muted-foreground mb-1">
            Multi-select checklist; &quot;Other&quot; triggers free-text input
          </p>
          <FormGroup>
            {MODELLING_STANDARD_OPTIONS.map((opt) => (
              <FormControlLabel
                key={opt}
                control={
                  <Checkbox
                    size="small"
                    checked={values.modelling_standard.includes(opt)}
                    onChange={onModellingStandardChange(opt)}
                  />
                }
                label={opt}
              />
            ))}
          </FormGroup>
        </FormControl>

        <TextField
          label="Modelling Standard – Other"
          fullWidth
          size="small"
          className="mb-4"
          value={values.modelling_standard_other}
          onChange={onChange("modelling_standard_other")}
        />
      </div>
    </div>
  );
}

