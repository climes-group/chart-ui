import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import {
  clearIntakeForm,
  selectIntakeForm,
  setIntakeForm,
} from "@/state/slices/reportReducer";
import { meetCondition, setError } from "@/state/slices/flowReducer";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { useTestMode } from "@/context/TestModeContext";
import type { IntakeForm } from "@/state/slices/reportReducer";
import type { AnyFieldMetaBase } from "@tanstack/form-core";
import {
  useForm,
  type ReactFormExtendedApi,
} from "@tanstack/react-form";
import type { StepCardProps } from "../../StepRenderer";
import AssessorInformationSection from "./AssessorInformationSection";
import BuildingInformationSection from "./BuildingInformationSection";
import FormSection from "./FormSection";
import ProjectInformationSection from "./ProjectInformationSection";
import SignatureSection from "./SignatureSection";

// Concrete form type with no validators; binds the 12 tanstack generics so
// section components can accept this exact shape without falling back to `any`.
export type IntakeFormApi = ReactFormExtendedApi<
  IntakeForm,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  unknown
>;

const PROJECT_REQUIRED = [
  "project_address",
  "municipality",
  "postal_code",
  "unit_model_type",
  "total_primary_units",
];
const ASSESSOR_REQUIRED = ["ea_name", "ea_number", "ea_phone", "ea_business"];
const SIGNATURE_REQUIRED = ["ea_signature", "builder_signature"];

export default function IntakeCard({ registerNext, nav }: StepCardProps) {
  const dispatch = useDispatch();
  const { intakeFillRef } = useTestMode();
  const { t } = useTranslation();
  const submitSucceeded = useRef(false);
  const savedForm = useSelector(selectIntakeForm);
  const form: IntakeFormApi = useForm({
    defaultValues: savedForm,
    onSubmit: async ({ value }) => {
      submitSucceeded.current = true;
      dispatch(setIntakeForm(value));
      dispatch(meetCondition({ name: "intake" }));
    },
  });

  useEffect(() => {
    registerNext?.(async () => {
      submitSucceeded.current = false;
      await form.handleSubmit();
      if (submitSucceeded.current) {
        nav?.();
      } else {
        dispatch(setError(t("intake.errorMessage")));
      }
    });
    if (intakeFillRef) {
      intakeFillRef.current = (data: Record<string, unknown>) => {
        const clearMeta = (prev: AnyFieldMetaBase) => ({
          ...prev,
          isTouched: false,
          errors: [],
          errorMap: {},
        });
        Object.entries(data).forEach(([key, value]) => {
          // Autofill loops over arbitrary string keys; setFieldValue/Meta want
          // a literal keyof IntakeForm. Cast once at this boundary.
          const k = key as keyof IntakeForm;
          form.setFieldValue(k, value as IntakeForm[typeof k]);
          form.setFieldMeta(k, clearMeta);
        });
      };
    }
    return () => {
      registerNext?.(null);
      if (intakeFillRef) intakeFillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h2 className="heading-card">{t("intake.heading")}</h2>
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
          {t("common.clear")}
        </Button>
      </div>
      <p className="body-muted mb-6">{t("intake.description")}</p>

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
          title={t("intake.section.project")}
          requiredFields={PROJECT_REQUIRED}
        >
          <ProjectInformationSection form={form} />
        </FormSection>

        <FormSection form={form} title={t("intake.section.building")}>
          <BuildingInformationSection form={form} />
        </FormSection>

        <FormSection
          form={form}
          title={t("intake.section.assessor")}
          requiredFields={ASSESSOR_REQUIRED}
        >
          <AssessorInformationSection form={form} />
        </FormSection>

        <FormSection
          form={form}
          title={t("intake.section.signature")}
          requiredFields={SIGNATURE_REQUIRED}
        >
          <SignatureSection form={form} />
        </FormSection>
      </form>
    </div>
  );
}
