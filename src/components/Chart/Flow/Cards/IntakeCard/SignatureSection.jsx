import { TextField } from "@mui/material";

export default function SignatureSection({ form }) {
  return (
    <div className="space-y-4">
      <h3 className="heading-section">Signature</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="ea_signature_date">
          {(field) => (
            <TextField
              label="EA Signature & Date"
              fullWidth
              placeholder="Capture Base64 + Date"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="builder_signature_date">
          {(field) => (
            <TextField
              label="Builder Signature & Date"
              fullWidth
              placeholder="Capture Base64 + Date"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
}
