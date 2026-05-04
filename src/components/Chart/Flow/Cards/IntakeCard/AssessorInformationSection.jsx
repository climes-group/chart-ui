import { useTranslation } from "@/i18n";
import { isValidPhone } from "@/lib/validators";
import { TextField } from "@mui/material";

export default function AssessorInformationSection({ form }) {
  const { t } = useTranslation();
  const required = t("validators.required");
  const phoneFormat = t("validators.phoneFormat");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field
          name="ea_name"
          validators={{
            onBlur: ({ value }) => (!value ? required : undefined),
          }}
        >
          {(field) => (
            <TextField
              label={t("intake.fields.eaName")}
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
            onBlur: ({ value }) => (!value ? required : undefined),
          }}
        >
          {(field) => (
            <TextField
              label={t("intake.fields.eaNumber")}
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
              if (!value) return required;
              if (!isValidPhone(value)) return phoneFormat;
              return undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              type="tel"
              label={t("intake.fields.eaPhone")}
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
            onBlur: ({ value }) => (!value ? required : undefined),
          }}
        >
          {(field) => (
            <TextField
              label={t("intake.fields.eaBusiness")}
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
              label={t("intake.fields.soCompanyName")}
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
              label={t("intake.fields.builderName")}
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
              if (!isValidPhone(value)) return phoneFormat;
              return undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              type="tel"
              label={t("intake.fields.builderPhone")}
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
