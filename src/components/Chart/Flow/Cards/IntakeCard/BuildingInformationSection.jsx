import { useTranslation } from "@/i18n";
import { TextField } from "@mui/material";

export default function BuildingInformationSection({ form }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="heated_floor_area">
          {(field) => (
            <TextField
              type="number"
              label={t("intake.fields.floorArea")}
              variant="outlined"
              fullWidth
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="number_of_floors">
          {(field) => (
            <TextField
              type="number"
              label={t("intake.fields.floors")}
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="electricity_use">
          {(field) => (
            <TextField
              type="number"
              label={t("intake.fields.electricity")}
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="fossil_fuel_use">
          {(field) => (
            <TextField
              type="number"
              label={t("intake.fields.fossilFuel")}
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="meui">
          {(field) => (
            <TextField
              type="number"
              label={t("intake.fields.meui")}
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="tedi">
          {(field) => (
            <TextField
              type="number"
              label={t("intake.fields.tedi")}
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="ghgi">
          {(field) => (
            <TextField
              type="number"
              label={t("intake.fields.ghgi")}
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
}
