import { TextField, Typography } from "@mui/material";

export default function BuildingInformationSection({ values, onChange }) {
  return (
    <div className="space-y-4">
      <Typography
        variant="h6"
        className="text-base font-semibold text-foreground"
      >
        Building Information
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Conditioned Floor Area"
          type="number"
          helperText="Units: m²"
          fullWidth
          size="small"
          className="mb-4"
          value={values.heated_floor_area}
          onChange={onChange("heated_floor_area")}
        />
        <TextField
          label="Number of Floors"
          type="number"
          helperText="Integer ≥ 1"
          fullWidth
          size="small"
          className="mb-4"
          value={values.number_of_floors}
          onChange={onChange("number_of_floors")}
        />
        <TextField
          label="Electricity Use"
          type="number"
          helperText="Units: kWh/year"
          fullWidth
          size="small"
          className="mb-4"
          value={values.electricity_use}
          onChange={onChange("electricity_use")}
        />
        <TextField
          label="Fossil Fuel Use"
          type="number"
          helperText="Units: GJ/year"
          fullWidth
          size="small"
          className="mb-4"
          value={values.fossil_fuel_use}
          onChange={onChange("fossil_fuel_use")}
        />
        <TextField
          label="MEUI"
          type="number"
          helperText="Mechanical Energy Use Intensity – kWh/m²/year"
          fullWidth
          size="small"
          className="mb-4"
          value={values.meui}
          onChange={onChange("meui")}
        />
        <TextField
          label="TEDI"
          type="number"
          helperText="Thermal Energy Demand Intensity – kWh/m²/year"
          fullWidth
          size="small"
          className="mb-4"
          value={values.tedi}
          onChange={onChange("tedi")}
        />
        <TextField
          label="GHGI"
          type="number"
          helperText="Greenhouse Gas Intensity – kg CO₂e/m²/year"
          fullWidth
          size="small"
          className="mb-4"
          value={values.ghgi}
          onChange={onChange("ghgi")}
        />
      </div>
    </div>
  );
}

