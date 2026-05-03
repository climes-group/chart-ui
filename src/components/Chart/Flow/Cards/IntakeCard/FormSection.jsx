import { useEffect, useRef, useState } from "react";
import { useStore } from "@tanstack/react-form";
import { CheckIcon } from "lucide-react";
import { useTranslation } from "@/i18n";

function isFilled(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== "" && value !== null && value !== undefined;
}

function shouldSkipAnimation() {
  if (typeof window === "undefined") return true;
  if (typeof IntersectionObserver === "undefined") return true;
  if (document.hidden) return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function useInView() {
  const ref = useRef(null);
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
  return [ref, inView];
}

export default function FormSection({
  form,
  title,
  requiredFields = [],
  children,
}) {
  const [ref, inView] = useInView();
  const { t } = useTranslation();
  const { filled, total } = useStore(form.store, (s) => ({
    total: requiredFields.length,
    filled: requiredFields.filter((name) => isFilled(s.values[name])).length,
  }));
  const complete = total > 0 && filled === total;

  return (
    <section
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        inView
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      <div className="sticky top-0 z-10 -mx-2 px-2 py-2 mb-4 flex items-center justify-between bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <h3 className="heading-section m-0">{title}</h3>
        {total > 0 && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums px-2 py-0.5 rounded-full transition-colors ${
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
