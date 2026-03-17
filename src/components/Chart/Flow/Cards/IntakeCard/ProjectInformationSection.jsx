import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";

const MODELLING_STANDARD_OPTIONS = [
  "EnerGuide",
  "Passive House",
  "CHBA Net-Zero",
  "Other",
];

export default function ProjectInformationSection({ form }) {
  return (
    <Paper variant="outlined" className="p-4 md:p-6 space-y-4">
      <h3 className="heading-section">Project Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="building_permit">
          {(field) => (
            <TextField
              label="Building Permit #"
              fullWidth
              variant="standard"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              helperText="If Applicable"
            />
          )}
        </form.Field>
        <form.Field
          name="project_address"
          validators={{
            onBlur: ({ value }) => (!value ? "Required" : undefined),
          }}
        >
          {(field) => (
            <TextField
              label="Project Address"
              fullWidth
              variant="standard"
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched && !!field.state.meta.errors.length
              }
              helperText={
                field.state.meta.isTouched && field.state.meta.errors[0]
              }
            />
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
              placeholder="e.g. v1.0"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
        <form.Field name="modelling_standard">
          {(field) => (
            <FormControl component="fieldset" sx={{ mt: 1 }}>
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

        {/* Conditional "Other" Field */}
        <form.Subscribe selector={(state) => state.values.modelling_standard}>
          {(standards) =>
            standards.includes("Other") && (
              <form.Field name="modelling_standard_other">
                {(field) => (
                  <TextField
                    label="Specify Other Standard"
                    fullWidth
                    variant="standard"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            )
          }
        </form.Subscribe>
      </div>
    </Paper>
  );
}
