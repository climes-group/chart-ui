import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
  clearIntakeForm,
  selectIntakeForm,
  setIntakeField,
  setIntakeForm,
} from "@/state/slices/reportReducer";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import AssessorInformationSection from "./AssessorInformationSection";
import BuildingInformationSection from "./BuildingInformationSection";
import ProjectInformationSection from "./ProjectInformationSection";
import SignatureSection from "./SignatureSection";

export default function IntakeCard({ onSubmit }) {
  const dispatch = useDispatch();
  const values = useSelector(selectIntakeForm);
  const [saved, setSaved] = useState(false);

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
    onSubmit: async ({ value, formApi }) => {
      console.log("Form Data Submitted:", value);
      setSaved(true);
      dispatch(setIntakeForm(value));
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

  return (
    <div>
      <h2 className="heading-card mb-1">Intake</h2>
      <p className="body-muted mb-4">
        Provide the project, building, and assessor information.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        <ProjectInformationSection form={form} />

        <BuildingInformationSection form={form} />

        <AssessorInformationSection form={form} />

        <SignatureSection form={form} />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              form.reset();
              dispatch(clearIntakeForm());
            }}
          >
            Clear
          </Button>
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDirty,
            ]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!canSubmit || (saved && !isDirty)}
              >
                {isSubmitting ? "Submitting..." : "Save"}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
