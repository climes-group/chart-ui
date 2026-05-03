import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  clearIntakeForm,
  selectIntakeForm,
  setIntakeForm,
} from "@/state/slices/reportReducer";
import { meetCondition, setError } from "@/state/slices/flowReducer";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { useTestMode } from "@/context/TestModeContext";
import { useForm } from "@tanstack/react-form";
import AssessorInformationSection from "./AssessorInformationSection";
import BuildingInformationSection from "./BuildingInformationSection";
import FormSection from "./FormSection";
import ProjectInformationSection from "./ProjectInformationSection";
import SignatureSection from "./SignatureSection";

const PROJECT_REQUIRED = [
  "project_address",
  "municipality",
  "postal_code",
  "unit_model_type",
  "total_primary_units",
];
const ASSESSOR_REQUIRED = ["ea_name", "ea_number", "ea_phone", "ea_business"];
const SIGNATURE_REQUIRED = ["ea_signature", "builder_signature"];

export default function IntakeCard({ activeStep, registerNext, nav }) {
  const dispatch = useDispatch();
  const { intakeFillRef } = useTestMode();
  const submitSucceeded = useRef(false);
  // Use persisted Redux state as default values so autofill (and persistence)
  // are reflected when the form mounts.
  const savedForm = useSelector(selectIntakeForm);
  const form = useForm({
    defaultValues: savedForm,
    onSubmit: async ({ value }) => {
      submitSucceeded.current = true;
      dispatch(setIntakeForm(value));
      dispatch(meetCondition({ name: "intake" }));
    },
  });

  useEffect(() => {
    registerNext(async () => {
      submitSucceeded.current = false;
      await form.handleSubmit();
      if (submitSucceeded.current) {
        nav();
      } else {
        dispatch(setError(activeStep?.errorMessage ?? "Please complete the intake form."));
      }
    });
    // Register a live field-setter so TestModePanel can autofill the mounted form
    if (intakeFillRef) {
      intakeFillRef.current = (data) => {
        const clearMeta = (prev) => ({ ...prev, isTouched: false, errors: [], errorMap: {} });
        Object.entries(data).forEach(([key, value]) => {
          form.setFieldValue(key, value);
          form.setFieldMeta(key, clearMeta);
        });
      };
    }
    return () => {
      registerNext(null);
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
            dispatch(setGeoData(undefined));
            dispatch(setHumanAddress(undefined));
            dispatch(meetCondition({ name: "intake", condition: false }));
            dispatch(setError(null));
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
        className="[&>section+section]:border-t [&>section+section]:border-warm-gold/30 [&>section+section]:mt-6 [&>section+section]:pt-6"
      >
        <FormSection
          form={form}
          title="Project Information"
          requiredFields={PROJECT_REQUIRED}
        >
          <ProjectInformationSection form={form} />
        </FormSection>

        <FormSection form={form} title="Building Information">
          <BuildingInformationSection form={form} />
        </FormSection>

        <FormSection
          form={form}
          title="Assessor Information"
          requiredFields={ASSESSOR_REQUIRED}
        >
          <AssessorInformationSection form={form} />
        </FormSection>

        <FormSection
          form={form}
          title="Signature"
          requiredFields={SIGNATURE_REQUIRED}
        >
          <SignatureSection form={form} />
        </FormSection>
      </form>
    </div>
  );
}
