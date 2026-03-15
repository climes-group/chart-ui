import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { selectIntakeForm, setIntakeField } from "@/state/slices/reportReducer";
import { useForm } from "@tanstack/react-form";
import AssessorInformationSection from "./AssessorInformationSection";
import BuildingInformationSection from "./BuildingInformationSection";
import ProjectInformationSection from "./ProjectInformationSection";
import SignatureSection from "./SignatureSection";

export default function IntakeCard({ onSubmit }) {
  const dispatch = useDispatch();
  const values = useSelector(selectIntakeForm);

  const form = useForm({
    defaultValues: {
      // Project Information
      building_permit: "",
      project_address: "",
      municipality: "",
      postal_code: "",
      pid_legal: "",
      unit_model_type: "",
      total_primary_units: 1,
      total_secondary_suites: 0,
      building_plan_date: "",
      building_plan_author: "",
      building_plan_version: "",
      modelling_standard: [],
      modelling_standard_other: "",
      // Building Information
      heated_floor_area: "",
      number_of_floors: 1,
      electricity_use: "",
      fossil_fuel_use: "",
      meui: "",
      tedi: "",
      ghgi: "",
      // Assessor Information
      ea_name: "",
      ea_number: "",
      ea_phone: "",
      ea_business: "",
      so_company_name: "",
      builder_name: "",
      builder_phone: "",
      ea_signature_date: "",
      builder_signature_date: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form Data Submitted:", value);
    },
  });

  const handleChange = (key) => (event) => {
    dispatch(setIntakeField({ key, value: event.target.value }));
  };

  const handleModellingStandardChange = (option) => (event) => {
    const current = Array.isArray(values.modelling_standard)
      ? values.modelling_standard
      : [];

    if (event.target.checked) {
      if (current.includes(option)) return;
      dispatch(
        setIntakeField({
          key: "modelling_standard",
          value: [...current, option],
        }),
      );
      return;
    }

    dispatch(
      setIntakeField({
        key: "modelling_standard",
        value: current.filter((item) => item !== option),
      }),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(values);
    }
  };

  return (
    <div>
      <h2 className="heading-card mb-1">Intake</h2>
      <p className="body-muted mb-4">
        Provide the core project, building, and assessor information to generate
        a complete intake record.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-card/40 border border-border rounded-lg p-4 md:p-6"
      >
        <ProjectInformationSection form={form} />

        <BuildingInformationSection form={form} />

        <AssessorInformationSection form={form} />

        <SignatureSection form={form} />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outlined" size="large" onClick={() => form.reset()}>
            Clear Form
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit Final Report"}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
