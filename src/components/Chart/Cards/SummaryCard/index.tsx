import { CircleQuestionMarkIcon, MapPin, Pencil } from "lucide-react";
import { useSelector } from "react-redux";

import useFlow from "@/hooks/useFlow";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation, type TranslateFn } from "@/i18n";
import {
  getFeatureKeyFor,
  getSystemCodeFor,
  type FeatureRecord,
  type IntakeForm,
  type SystemRecord,
} from "@/state/slices/reportReducer";
import type { RootState } from "@/state/store";
import { formatLatLong } from "./utils";

function sanitizeName(name: string | null | undefined): string {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replaceAll("_", " ");
}

function getDescription(
  record: SystemRecord | FeatureRecord,
  locale: string,
): string {
  const description =
    (locale === "fr-CA"
      ? (record["DescriptionFr"] as string)
      : (record["Description"] as string)) || (record["Description"] as string);
  return description ?? "";
}

type SectionHeaderProps = {
  title: string;
  editTo: string;
  editLabel: string;
  headingId: string;
};

function SectionHeader({
  title,
  editTo,
  editLabel,
  headingId,
}: Readonly<SectionHeaderProps>) {
  const { t } = useTranslation();
  const { jumpTo } = useFlow();
  return (
    <div className="mb-2 flex items-center justify-between">
      <h3 id={headingId} className="heading-section">
        {title}
      </h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => jumpTo(editTo)}
        aria-label={"Jump to " + editLabel}
        title={editLabel}
        className="text-muted-foreground hover:text-primary"
      >
        <Pencil className="size-3" />
        {t("summary.edit")}
      </Button>
    </div>
  );
}

function groupByKey<T>(
  items: T[],
  getKey: (item: T) => string,
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = getKey(item) || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

type ServicePillListProps = {
  groups: Record<string, { name: string; description: string }[]>;
};

function ServicePillList({ groups }: Readonly<ServicePillListProps>) {
  const services = Object.keys(groups).sort((a, b) => a.localeCompare(b));
  return (
    <TooltipProvider>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service}>
            <p className="heading-label mb-1.5">{sanitizeName(service)}</p>
            <div className="flex flex-wrap gap-1.5">
              {groups[service].map(({ name, description }, index) => (
                <SummaryPill
                  key={`${name}-${index}`}
                  name={name}
                  description={description}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}

function SummaryPill({
  name,
  description,
}: Readonly<{ name: string; description: string }>) {
  const pill = (
    <span className="border-border bg-muted/40 text-foreground inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-sm">
      <span className="min-w-0 break-words">{name}</span>
      {description && (
        <CircleQuestionMarkIcon
          aria-hidden="true"
          className="text-muted-foreground size-4 shrink-0"
          strokeWidth={2}
        />
      )}
    </span>
  );

  if (!description) return pill;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>{pill}</span>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
}

function formatHeadline(intake: IntakeForm, t: TranslateFn): string | null {
  const type = intake.unit_model_type;
  const primary = Number(intake.total_primary_units);
  const secondary = Number(intake.total_secondary_suites);

  const counts: string[] = [];
  if (Number.isFinite(primary) && primary > 0) {
    const key =
      primary === 1 ? "summary.primaryUnits.one" : "summary.primaryUnits.other";
    counts.push(t(key, { count: primary }));
  }
  if (Number.isFinite(secondary) && secondary > 0) {
    const key =
      secondary === 1
        ? "summary.secondarySuites.one"
        : "summary.secondarySuites.other";
    counts.push(t(key, { count: secondary }));
  }

  if (!type) return counts.join(" + ") || null;
  if (counts.length === 0) return type;
  return `${type} — ${counts.join(" + ")}`;
}

function formatStandards(intake: IntakeForm): string[] {
  const list = intake.modelling_standard || [];
  const other = intake.modelling_standard_other;
  return list.map((s) => (s === "Other" && other ? other : s));
}

function formatPlanLine(intake: IntakeForm, t: TranslateFn): string | null {
  const parts: string[] = [];
  if (intake.building_plan_version) parts.push(intake.building_plan_version);
  if (intake.building_plan_date) parts.push(intake.building_plan_date);
  if (intake.building_plan_author) parts.push(intake.building_plan_author);
  if (parts.length === 0) return null;
  return t("summary.plan", { value: parts.join(" · ") });
}

function ProjectInformation({ intake }: Readonly<{ intake: IntakeForm }>) {
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
            {standards.map((s) => (
              <SystemPill key={s} name={s} />
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

function SystemPill({ name }: Readonly<{ name: string }>) {
  return (
    <span className="border-primary bg-primary/10 text-primary inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-medium">
      {name}
    </span>
  );
}

function SummaryCard() {
  const selectedSystems = useSelector(
    (state: RootState) => state.report.selectedSystems,
  );
  const selectedSiteFeatures = useSelector(
    (state: RootState) => state.report.selectedSiteFeatures,
  );
  const { geoData, humanAddress } = useSelector(
    (state: RootState) => state.geo,
  );
  const intakeForm = useSelector((state: RootState) => state.report.intakeForm);
  const { locale, t } = useTranslation();

  const hasIntakeData =
    intakeForm &&
    Object.values(intakeForm).some((v) =>
      Array.isArray(v) ? v.length > 0 : v !== "",
    );

  const validSelectedSystems = (selectedSystems || []).filter(
    (s) => s && typeof s === "object" && getSystemCodeFor(s),
  );

  const validSelectedSiteFeatures = (selectedSiteFeatures || []).filter(
    (f) => f && typeof f === "object" && getFeatureKeyFor(f),
  );

  const systemGroups = Object.fromEntries(
    Object.entries(
      groupByKey(
        validSelectedSystems,
        (s) => (s["Services"] as string) || "Other",
      ),
    ).map(([k, systems]) => [
      k,
      systems.map((s) => ({
        name: sanitizeName(s["ASTM.System.Name"] as string),
        description: getDescription(s, locale as string),
      })),
    ]),
  );

  const featureGroups = Object.fromEntries(
    Object.entries(
      groupByKey(
        validSelectedSiteFeatures,
        (f) => (f["Category"] as string) || "Other",
      ),
    ).map(([k, features]) => [
      k,
      features.map((f) => ({
        name: sanitizeName(f["Site.Feature.Name"] as string),
        description: getDescription(f, locale as string),
      })),
    ]),
  );

  return (
    <div className="divide-border overflow-hidden rounded-lg border bg-card divide-y">
      <section
        aria-labelledby="summary-project-heading"
        className="p-3 sm:p-4 md:p-5"
      >
        <SectionHeader
          title={t("summary.section.project")}
          editTo="intake"
          editLabel={t("summary.editProject")}
          headingId="summary-project-heading"
        />
        {hasIntakeData ? (
          <ProjectInformation intake={intakeForm} />
        ) : (
          <p className="body-muted">{t("summary.empty.project")}</p>
        )}
      </section>

      <section
        aria-labelledby="summary-location-heading"
        className="p-3 sm:p-4 md:p-5"
      >
        <SectionHeader
          title={t("summary.section.location")}
          editTo="intake"
          editLabel={t("summary.editProject")}
          headingId="summary-location-heading"
        />
        {humanAddress || geoData ? (
          <div className="flex items-start gap-2">
            <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-foreground text-sm">{humanAddress || "N/A"}</p>
              {geoData && (
                <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                  {formatLatLong(geoData.lat, geoData.lng)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="body-muted">{t("summary.empty.location")}</p>
        )}
      </section>

      <section
        aria-labelledby="summary-systems-heading"
        className="p-3 sm:p-4 md:p-5"
      >
        <SectionHeader
          title={
            validSelectedSystems.length > 0
              ? t("summary.section.systemsCount", {
                  count: validSelectedSystems.length,
                })
              : t("summary.section.systems")
          }
          editTo="systems"
          editLabel={t("summary.editSystems")}
          headingId="summary-systems-heading"
        />
        {validSelectedSystems.length === 0 ? (
          <p className="body-muted">{t("summary.empty.systems")}</p>
        ) : (
          <ServicePillList groups={systemGroups} />
        )}
      </section>

      <section
        aria-labelledby="summary-features-heading"
        className="p-3 sm:p-4 md:p-5"
      >
        <SectionHeader
          title={
            validSelectedSiteFeatures.length > 0
              ? t("summary.section.featuresCount", {
                  count: validSelectedSiteFeatures.length,
                })
              : t("summary.section.features")
          }
          editTo="features"
          editLabel={t("summary.editFeatures")}
          headingId="summary-features-heading"
        />
        {validSelectedSiteFeatures.length === 0 ? (
          <p className="body-muted">{t("summary.empty.features")}</p>
        ) : (
          <ServicePillList groups={featureGroups} />
        )}
      </section>
    </div>
  );
}

export default SummaryCard;
