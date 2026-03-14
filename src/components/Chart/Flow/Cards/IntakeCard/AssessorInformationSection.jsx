import { TextField, Typography } from "@mui/material";

export default function AssessorInformationSection({ values, onChange }) {
  return (
    <div className="space-y-4">
      <Typography
        variant="h6"
        className="text-base font-semibold text-foreground"
      >
        Assessor Information
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="EA Name"
          helperText="Energy Advisor full name"
          required
          fullWidth
          size="small"
          className="mb-4"
          value={values.ea_name}
          onChange={onChange("ea_name")}
        />
        <TextField
          label="EA Number"
          required
          fullWidth
          size="small"
          className="mb-4"
          value={values.ea_number}
          onChange={onChange("ea_number")}
        />
        <TextField
          label="EA Phone Number"
          type="tel"
          required
          fullWidth
          size="small"
          className="mb-4"
          value={values.ea_phone}
          onChange={onChange("ea_phone")}
        />
        <TextField
          label="EA Business #"
          required
          fullWidth
          size="small"
          className="mb-4"
          value={values.ea_business}
          onChange={onChange("ea_business")}
        />
        <TextField
          label="SO Company Name"
          helperText="Service Organisation company name"
          fullWidth
          size="small"
          className="mb-4"
          value={values.so_company_name}
          onChange={onChange("so_company_name")}
        />
        <TextField
          label="Builder Name"
          fullWidth
          size="small"
          className="mb-4"
          value={values.builder_name}
          onChange={onChange("builder_name")}
        />
        <TextField
          label="Builder Phone #"
          type="tel"
          fullWidth
          size="small"
          className="mb-4"
          value={values.builder_phone}
          onChange={onChange("builder_phone")}
        />

        <TextField
          label="EA Signature and Date"
          helperText="Capture as base64 image + ISO date string"
          multiline
          minRows={3}
          fullWidth
          size="small"
          className="mb-4"
          value={values.ea_signature_date}
          onChange={onChange("ea_signature_date")}
        />
        <TextField
          label="Builder Signature and Date"
          helperText="Capture as base64 image + ISO date string"
          multiline
          minRows={3}
          fullWidth
          size="small"
          className="mb-4"
          value={values.builder_signature_date}
          onChange={onChange("builder_signature_date")}
        />
      </div>
    </div>
  );
}

