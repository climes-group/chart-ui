import { TextField } from "@mui/material";

export default function AssessorInformationSection({ form }) {
  return (
    <div className="p-2 md:p-6 space-y-4">
      <h3 className="heading-section">Assessor Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              variant="standard"
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
              variant="standard"
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
            onBlur: ({ value }) => (!value ? "Required" : undefined),
          }}
        >
          {(field) => (
            <TextField
              type="tel"
              label="EA Phone"
              fullWidth
              required
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="builder_phone">
          {(field) => (
            <TextField
              type="tel"
              label="Builder Phone #"
              fullWidth
              variant="standard"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
}
