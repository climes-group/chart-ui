import { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { useStore } from "@tanstack/react-form";
import SignatureCanvas from "react-signature-canvas";

import { Button } from "@/components/ui/button";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function SignaturePad({ form, signatureFieldName, dateFieldName, label, testId }) {
  const ref = useRef(null);
  const value = useStore(form.store, (s) => s.values[signatureFieldName]);

  // Restore a persisted signature on mount.
  useEffect(() => {
    if (value && ref.current) {
      ref.current.fromDataURL(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the canvas visually in sync when external state (card-level Clear,
  // TestModePanel autofill) changes the value.
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
          {(field) => (
            <TextField
              type="date"
              label={`${label} Date`}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              inputProps={{ "data-testid": `${testId}-date` }}
            />
          )}
        </form.Field>

        <form.Field
          name={signatureFieldName}
          validators={{
            onChange: ({ value }) => (!value ? "Signature required" : undefined),
            onSubmit: ({ value }) => (!value ? "Signature required" : undefined),
          }}
        >
          {(field) => {
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
              field.state.meta.isTouched && field.state.meta.errors.length > 0;

            return (
              <div className="flex flex-col">
                <div
                  className={`border-2 rounded bg-white h-40 relative ${
                    hasError ? "border-destructive" : "border-muted-foreground/40"
                  }`}
                  style={{ touchAction: "none" }}
                >
                  <SignatureCanvas
                    ref={ref}
                    onEnd={handleEnd}
                    canvasProps={{
                      className: "w-full h-full",
                      "data-testid": testId,
                    }}
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
                      Sign above
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={handleClear}
                    data-testid={`${testId}-clear`}
                  >
                    Clear signature
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

export default function SignatureSection({ form }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SignaturePad
          form={form}
          signatureFieldName="ea_signature"
          dateFieldName="ea_signature_date"
          label="EA Signature"
          testId="ea-sig-canvas"
        />

        <SignaturePad
          form={form}
          signatureFieldName="builder_signature"
          dateFieldName="builder_signature_date"
          label="Builder Signature"
          testId="builder-sig-canvas"
        />
      </div>
    </div>
  );
}
