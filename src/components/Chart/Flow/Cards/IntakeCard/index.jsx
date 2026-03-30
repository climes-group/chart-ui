import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  clearIntakeForm,
  setIntakeForm,
} from "@/state/slices/reportReducer";
import { useForm } from "@tanstack/react-form";
import AssessorInformationSection from "./AssessorInformationSection";
import BuildingInformationSection from "./BuildingInformationSection";
import ProjectInformationSection from "./ProjectInformationSection";
import SignatureSection from "./SignatureSection";

export default function IntakeCard({ registerNext }) {
  const dispatch = useDispatch();
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
      dispatch(setIntakeForm(value));
    },
  });

  useEffect(() => {
    registerNext(() => form.handleSubmit());
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h2 className="heading-card">Intake</h2>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="text-muted-foreground hover:text-destructive -mt-1"
          onClick={() => {
            form.reset();
            dispatch(clearIntakeForm());
          }}
        >
          Clear
        </Button>
      </div>
      <p className="body-muted mb-6">
        Provide the project, building, and assessor information.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Project Information */}
        <ProjectInformationSection form={form} />

        {/* Building Information */}
        <div className="border-t border-warm-gold/30 mt-6 pt-6">
          <BuildingInformationSection form={form} />
        </div>

        {/* Assessor Information */}
        <div className="border-t border-warm-gold/30 mt-6 pt-6">
          <AssessorInformationSection form={form} />
        </div>

        {/* Signature */}
        <div className="border-t border-warm-gold/30 mt-6 pt-6">
          <SignatureSection form={form} />
        </div>
      </form>
    </div>
  );
}
