import { ArrowRight } from "lucide-react";
import { useState } from "react";
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

export default function IntakeCard({ onSubmit }) {
  const dispatch = useDispatch();
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
    onSubmit: async ({ value }) => {
      setSaved(true);
      dispatch(setIntakeForm(value));
    },
  });

  return (
    <div>
      <h2 className="heading-card mb-1">Intake</h2>
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

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-warm-gold/30 mt-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              form.reset();
              dispatch(clearIntakeForm());
              setSaved(false);
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
                disabled={!canSubmit || (saved && !isDirty)}
                className="bg-moss-primary text-white hover:bg-moss-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? "Saving…" : "Save"}
                <ArrowRight className="size-4" />
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
