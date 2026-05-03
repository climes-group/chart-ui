import { isValidPhone } from "@/lib/validators";
import { TextField } from "@mui/material";

export default function AssessorInformationSection({ form }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field
          name="ea_name"
          validators={{
            onBlur: ({ value }) => (!value ? "Required" : undefined),
          }}
        >
          {(field) => (
            <TextField
              label="EA Name"
              fullWidth
              required
              variant="outlined"
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
          name="ea_number"
          validators={{
            onBlur: ({ value }) => (!value ? "Required" : undefined),
          }}
        >
          {(field) => (
            <TextField
              label="EA Number"
              fullWidth
              required
              variant="outlined"
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
          name="ea_phone"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return "Required";
              if (!isValidPhone(value)) return "Format: 555-555-0100";
              return undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              type="tel"
              label="EA Phone"
              fullWidth
              required
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched && !!field.state.meta.errors.length
              }
              helperText={
                field.state.meta.isTouched && field.state.meta.errors.length
                  ? field.state.meta.errors[0]
                  : ""
              }
            />
          )}
        </form.Field>

        <form.Field
          name="ea_business"
          validators={{
            onBlur: ({ value }) => (!value ? "Required" : undefined),
          }}
        >
          {(field) => (
            <TextField
              label="EA Business #"
              fullWidth
              required
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched && !!field.state.meta.errors.length
              }
            />
          )}
        </form.Field>

        <form.Field name="so_company_name">
          {(field) => (
            <TextField
              label="Service Organisation Company Name"
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="builder_name">
          {(field) => (
            <TextField
              label="Builder Name"
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field
          name="builder_phone"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return undefined;
              if (!isValidPhone(value)) return "Format: 555-555-0100";
              return undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              type="tel"
              label="Builder Phone #"
              fullWidth
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched && !!field.state.meta.errors.length
              }
              helperText={
                field.state.meta.isTouched && field.state.meta.errors.length
                  ? field.state.meta.errors[0]
                  : ""
              }
            />
          )}
        </form.Field>
      </div>
    </div>
  );
}
