import { useTranslation } from "@/i18n";
import type { AnyFormState } from "@tanstack/form-core";
import { useStore } from "@tanstack/react-form";
import type { IntakeFormApi } from ".";
import { CheckIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

function isFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return value !== "" && value !== null && value !== undefined;
}

function shouldSkipAnimation() {
  if (globalThis.window === undefined) return true;
  if (typeof IntersectionObserver === "undefined") return true;
  if (document.hidden) return true;
  return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function useInView(): [React.RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(() => shouldSkipAnimation());
  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [inView]);
  return [ref as React.RefObject<HTMLElement>, inView];
}

type Props = {
  form: IntakeFormApi;
  title: string;
  requiredFields?: string[];
  children?: ReactNode;
};

export default function FormSection({
  form,
  title,
  requiredFields = [],
  children,
}: Readonly<Props>) {
  const [ref, inView] = useInView();
  const { t } = useTranslation();
  const { filled, total } = useStore(form.store, (snapshot: AnyFormState) => ({
    total: requiredFields.length,
    filled: requiredFields.filter((name) =>
      isFilled((snapshot.values as Record<string, unknown>)[name]),
    ).length,
  }));
  const complete = total > 0 && filled === total;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`transition-all duration-500 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="bg-card/80 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-10 -mx-2 mb-4 flex items-center justify-between px-2 py-2 backdrop-blur">
        <h3 className="heading-section m-0">{title}</h3>
        {total > 0 && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums transition-colors ${
              complete
                ? "bg-moss-primary/10 text-moss-primary"
                : "bg-muted text-muted-foreground"
            }`}
            aria-label={t("intake.fieldsCompleted", { filled, total })}
          >
            {complete && <CheckIcon className="h-3 w-3" aria-hidden="true" />}
            {filled}/{total}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
