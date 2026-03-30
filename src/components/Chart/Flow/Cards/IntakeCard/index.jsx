import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  clearIntakeForm,
  selectIntakeForm,
  setIntakeForm,
} from "@/state/slices/reportReducer";
import { useTestMode } from "@/context/TestModeContext";
import { useForm } from "@tanstack/react-form";
import AssessorInformationSection from "./AssessorInformationSection";
import BuildingInformationSection from "./BuildingInformationSection";
import ProjectInformationSection from "./ProjectInformationSection";
import SignatureSection from "./SignatureSection";

export default function IntakeCard({ registerNext }) {
  const dispatch = useDispatch();
  const { intakeFillRef } = useTestMode();
  // Use persisted Redux state as default values so autofill (and persistence)
  // are reflected when the form mounts.
  const savedForm = useSelector(selectIntakeForm);
  const form = useForm({
    defaultValues: savedForm,
    onSubmit: async ({ value }) => {
      dispatch(setIntakeForm(value));
    },
  });

  useEffect(() => {
    registerNext(() => form.handleSubmit());
    // Register a live field-setter so TestModePanel can autofill the mounted form
    if (intakeFillRef) {
      intakeFillRef.current = (data) => {
        Object.entries(data).forEach(([key, value]) => {
          form.setFieldValue(key, value);
        });
      };
    }
    return () => {
      if (intakeFillRef) intakeFillRef.current = null;
    };
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
