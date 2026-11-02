import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTestMode } from "@/components/TestMode/TestModeContext";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { meetCondition, setError } from "@/state/slices/flowReducer";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import type { IntakeForm } from "@/state/slices/reportReducer";
import {
  clearIntakeForm,
  selectIntakeForm,
  setIntakeForm,
} from "@/state/slices/reportReducer";
import { RootState } from "@/state/store";
import type { AnyFieldMetaBase } from "@tanstack/form-core";
import { useForm, type ReactFormExtendedApi } from "@tanstack/react-form";
import { X } from "lucide-react";
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
  () => { form: string } | undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  unknown
>;

const PROJECT_REQUIRED: (keyof IntakeForm)[] = [
  "project_address",
  "municipality",
  "unit_model_type",
  "total_primary_units",
];
const ASSESSOR_REQUIRED: (keyof IntakeForm)[] = [
  "ea_name",
  "ea_number",
  "ea_phone",
  "ea_business",
];
const SIGNATURE_REQUIRED: (keyof IntakeForm)[] = [
  "ea_signature",
  "builder_signature",
];
const VALIDATED_FIELDS: (keyof IntakeForm)[] = [
  ...PROJECT_REQUIRED,
  ...ASSESSOR_REQUIRED,
  ...SIGNATURE_REQUIRED,
  "postal_code",
  "builder_phone",
];

export default function IntakeCard({
  registerNext,
  nav,
}: Readonly<StepCardProps>) {
  const dispatch = useDispatch();
  const { intakeFillRef } = useTestMode();
  const { t } = useTranslation();
  const submitSucceeded = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const savedForm = useSelector(selectIntakeForm);
  const geoData = useSelector((state: RootState) => state.geo.geoData);

  const form: IntakeFormApi = useForm({
    defaultValues: savedForm,
    onSubmit: ({ value }) => {
      submitSucceeded.current = true;
      dispatch(setIntakeForm(value));
      dispatch(meetCondition({ name: "intake" }));
    },
    validators: {
      onSubmit: () => {
        // if geoData is not set, we can't submit the form
        if (!geoData) {
          return {
            form: "Please select a valid address from suggestions or use device location.",
          };
        }
      },
    },
  });

  useEffect(() => {
    registerNext(async () => {
      submitSucceeded.current = false;
      await form.handleSubmit();

      if (submitSucceeded.current) {
        nav();
      } else {
        VALIDATED_FIELDS.forEach((name) => {
          form.setFieldMeta(name, (prev) => ({ ...prev, isTouched: true }));
        });
        dispatch(
          setError(form.state.errors[0]?.form ?? t("intake.errorMessage")),
        );
        requestAnimationFrame(() => {
          formRef.current
            ?.querySelector<HTMLElement>('[aria-invalid="true"]')
            ?.focus();
        });
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
      registerNext(null);
      if (intakeFillRef) intakeFillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <em className="text-muted-foreground text-sm">
          {t("intake.description")}
        </em>
        <Button
          variant="muted"
          size="sm"
          type="button"
          onClick={() => {
            form.reset();
            dispatch(clearIntakeForm());
            dispatch(setGeoData(undefined));
            dispatch(setHumanAddress(undefined));
            dispatch(meetCondition({ name: "intake", condition: false }));
            dispatch(setError(null));
          }}
        >
          <X aria-hidden />
          {t("common.clear")}
        </Button>
      </div>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-4 space-y-10"
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
