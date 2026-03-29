import { TextField } from "@mui/material";

export default function SignatureSection({ form }) {
  return (
    <div className="space-y-4">
      <h3 className="heading-section">Signature</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field name="ea_signature_date">
          {(field) => (
            <TextField
              type="date"
              label="EA Signature Date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="builder_signature_date">
          {(field) => (
            <TextField
              type="date"
              label="Builder Signature Date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
}
