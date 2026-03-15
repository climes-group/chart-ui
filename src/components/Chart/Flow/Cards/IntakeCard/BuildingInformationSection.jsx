import { TextField } from "@mui/material";

export default function BuildingInformationSection({ form }) {
  return (
    <div className="space-y-4">
      <h3 className="heading-section">Building Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="heated_floor_area">
          {(field) => (
            <TextField
              type="number"
              label="Floor Area (m²)"
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
              label="Floors"
              fullWidth
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="electricity_use">
          {(field) => (
            <TextField
              type="number"
              label="Electricity (kWh/y)"
              fullWidth
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="fossil_fuel_use">
          {(field) => (
            <TextField
              type="number"
              label="Fossil Fuel (GJ/y)"
              fullWidth
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="meui">
          {(field) => (
            <TextField
              type="number"
              label="MEUI (kWh/m²/y)"
              fullWidth
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="tedi">
          {(field) => (
            <TextField
              type="number"
              label="TEDI (kWh/m²/y)"
              fullWidth
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="ghgi">
          {(field) => (
            <TextField
              type="number"
              label="GHGI (kg CO₂e/m²/y)"
              fullWidth
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
}
