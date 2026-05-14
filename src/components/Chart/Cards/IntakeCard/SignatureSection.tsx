import { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import type { AnyFieldApi, AnyFormState } from "@tanstack/form-core";
import { useStore } from "@tanstack/react-form";
import SignatureCanvas from "react-signature-canvas";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { cn } from "@/utils/cn";
import type { IntakeFormApi } from ".";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

type PadProps = {
  form: IntakeFormApi;
  signatureFieldName: "ea_signature" | "builder_signature";
  dateFieldName: "ea_signature_date" | "builder_signature_date";
  label: string;
  testId: string;
};

function SignaturePad({
  form,
  signatureFieldName,
  dateFieldName,
  label,
  testId,
}: Readonly<PadProps>) {
  const ref = useRef<SignatureCanvas | null>(null);
  const { t } = useTranslation();
  const value = useStore(
    form.store,
    (snapshot: AnyFormState) =>
      (snapshot.values as Record<string, string>)[signatureFieldName],
  );

  useEffect(() => {
    if (value && ref.current) {
      ref.current.fromDataURL(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!value && !canvas.isEmpty()) {
      canvas.clear();
    } else if (value && canvas.isEmpty()) {
      canvas.fromDataURL(value);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground">{label}</h4>
      <div className="flex flex-col gap-3">
        <form.Field name={dateFieldName}>
          {(field: AnyFieldApi) => (
            <TextField
              type="date"
              label={t("intake.fields.signatureDate", { label })}
              fullWidth
              variant="outlined"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { "data-testid": `${testId}-date` },
              }}
            />
          )}
        </form.Field>

        <form.Field
          name={signatureFieldName}
          validators={{
            onChange: ({ value }: { value: string }) =>
              value ? undefined : t("validators.signatureRequired"),
            onSubmit: ({ value }: { value: string }) =>
              value ? undefined : t("validators.signatureRequired"),
          }}
        >
          {(field: AnyFieldApi) => {
            const handleEnd = () => {
              if (!ref.current || ref.current.isEmpty()) return;
              const url = ref.current.toDataURL("image/png");
              field.handleChange(url);
              field.handleBlur();
              if (form.getFieldValue(dateFieldName) === "") {
                form.setFieldValue(dateFieldName, todayISO());
              }
            };

            const handleClear = () => {
              ref.current?.clear();
              field.handleChange("");
              field.handleBlur();
              form.setFieldValue(dateFieldName, "");
            };

            const hasError =
              field.state.meta.isTouched &&
              field.state.meta.errors.length > 0;

            return (
              <div className="flex flex-col">
                <div
                  className={cn(
                    "relative h-40 touch-none rounded border-2 bg-white",
                    hasError ? "border-destructive" : "border-muted-foreground/40",
                  )}
                >
                  <SignatureCanvas
                    ref={ref}
                    onEnd={handleEnd}
                    canvasProps={
                      {
                        className: "w-full h-full",
                        "data-testid": testId,
                      } as React.CanvasHTMLAttributes<HTMLCanvasElement>
                    }
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  {hasError ? (
                    <p
                      className="text-sm text-destructive"
                      data-testid={`${testId}-error`}
                    >
                      {field.state.meta.errors[0]}
                    </p>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {t("intake.fields.signAbove")}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={handleClear}
                    data-testid={`${testId}-clear`}
                  >
                    {t("intake.fields.clearSignature")}
                  </Button>
                </div>
              </div>
            );
          }}
        </form.Field>
      </div>
    </div>
  );
}

type Props = { form: IntakeFormApi };

export default function SignatureSection({ form }: Readonly<Props>) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SignaturePad
          form={form}
          signatureFieldName="ea_signature"
          dateFieldName="ea_signature_date"
          label={t("intake.fields.eaSignature")}
          testId="ea-sig-canvas"
        />

        <SignaturePad
          form={form}
          signatureFieldName="builder_signature"
          dateFieldName="builder_signature_date"
          label={t("intake.fields.builderSignature")}
          testId="builder-sig-canvas"
        />
      </div>
    </div>
  );
}
