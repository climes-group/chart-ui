import { useTranslation } from "@/i18n";
import { TextField } from "@mui/material";
import { type AnyFieldApi } from "@tanstack/form-core";
import type { IntakeFormApi } from ".";

type Props = { form: IntakeFormApi };

export default function BuildingInformationSection({ form }: Readonly<Props>) {
  const { t } = useTranslation();
  const fields: { name: string; label: string }[] = [
    { name: "heated_floor_area", label: t("intake.fields.floorArea") },
    { name: "number_of_floors", label: t("intake.fields.floors") },
    { name: "electricity_use", label: t("intake.fields.electricity") },
    { name: "fossil_fuel_use", label: t("intake.fields.fossilFuel") },
    { name: "meui", label: t("intake.fields.meui") },
    { name: "tedi", label: t("intake.fields.tedi") },
    { name: "ghgi", label: t("intake.fields.ghgi") },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ name, label }) => (
          <form.Field key={name} name={name}>
            {(field: AnyFieldApi) => (
              <TextField
                type="number"
                label={label}
                fullWidth
                variant="outlined"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        ))}
      </div>
    </div>
  );
}
