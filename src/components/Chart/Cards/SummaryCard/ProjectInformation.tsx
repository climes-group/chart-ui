import { useTranslation } from "@/i18n";
import type { IntakeForm } from "@/state/slices/reportReducer";
import {
  formatHeadline,
  formatPlanLine,
  formatStandards,
} from "./utils";

export default function ProjectInformation({
  intake,
}: Readonly<{ intake: IntakeForm }>) {
  const { t } = useTranslation();
  const headline = formatHeadline(intake, t);
  const standards = formatStandards(intake);
  const planLine = formatPlanLine(intake, t);
  const permit = intake.building_permit;
  const pid = intake.pid_legal;

  const hasAnything =
    headline || standards.length > 0 || planLine || permit || pid;
  if (!hasAnything) {
    return <p className="body-muted">{t("summary.empty.project")}</p>;
  }

  return (
    <div className="space-y-2">
      {headline && <p className="text-foreground text-sm">{headline}</p>}

      {standards.length > 0 && (
        <div>
          <p className="heading-label mb-1.5">
            {t("intake.fields.modellingStandard")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {standards.map((standard) => (
              <span
                key={standard}
                className="border-primary bg-primary/10 text-primary inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-medium"
              >
                {standard}
              </span>
            ))}
          </div>
        </div>
      )}

      {(planLine || permit || pid) && (
        <div className="space-y-0.5">
          {planLine && <p className="body-muted">{planLine}</p>}
          {permit && (
            <p className="body-muted">
              {t("summary.permit", { value: permit })}
            </p>
          )}
          {pid && (
            <p className="body-muted">{t("summary.pid", { value: pid })}</p>
          )}
        </div>
      )}
    </div>
  );
}
