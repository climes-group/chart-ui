import { MapPin, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
  return name.replaceAll('_', " ");
}

function getSystemDisplayName(system: SystemRecord): string {
  return (system["ASTM.Name"] as string) || (system["Classification"] as string);
}

function getSiteFeatureDisplayName(feature: FeatureRecord): string {
  return (
    (feature["Site.Feature.Name"] as string) ||
    (feature["Classification"] as string)
  );
}

type SectionHeaderProps = {
  title: string;
  editTo: string;
  editLabel: string;
};

function SectionHeader({ title, editTo, editLabel }: Readonly<SectionHeaderProps>) {
  const { t } = useTranslation();
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="heading-section">{title}</h3>
      <Link
        to={editTo}
        aria-label={editLabel}
        title={editLabel}
        className="text-muted-foreground hover:text-teal-deep flex items-center gap-1 text-xs transition-colors"
      >
        <Pencil className="size-3" />
        {t("summary.edit")}
      </Link>
    </div>
  );
}

function groupByKey<T>(items: T[], getKey: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = getKey(item) || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

type ServicePillListProps = {
  groups: Record<string, { name: string; code?: string }[]>;
};

function ServicePillList({ groups }: Readonly<ServicePillListProps>) {
  const services = Object.keys(groups).sort((a, b) => a.localeCompare(b));
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service}>
          <p className="heading-label mb-2">{sanitizeName(service)}</p>
          <div className="flex flex-wrap gap-2">
            {groups[service].map(({ name, code }) => (
              <SystemPill key={code ?? name} name={name} code={code} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SystemPill({ name, code }: Readonly<{ name: string; code?: string }>) {
  return (
    <span className="border-teal-deep bg-teal-deep/10 text-teal-deep inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm font-medium">
      <span>{name}</span>
      {code && (
        <span className="text-warm-brown font-mono text-xs">{code}</span>
      )}
    </span>
  );
}

function formatHeadline(intake: IntakeForm, t: TranslateFn): string | null {
  const type = intake.unit_model_type;
  const primary = Number(intake.total_primary_units);
  const secondary = Number(intake.total_secondary_suites);

  const counts: string[] = [];
  if (Number.isFinite(primary) && primary > 0) {
    const key =
      primary === 1
        ? "summary.primaryUnits.one"
        : "summary.primaryUnits.other";
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
    <div className="space-y-3">
      {headline && <p className="text-foreground text-sm">{headline}</p>}

      {standards.length > 0 && (
        <div>
          <p className="heading-label mb-2">
            {t("intake.fields.modellingStandard")}
          </p>
          <div className="flex flex-wrap gap-2">
            {standards.map((s) => (
              <SystemPill key={s} name={s} />
            ))}
          </div>
        </div>
      )}

      {(planLine || permit || pid) && (
        <div className="space-y-1">
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
  const intakeForm = useSelector(
    (state: RootState) => state.report.intakeForm,
  );
  const { t } = useTranslation();

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
    Object.entries(groupByKey(validSelectedSystems, (s) => (s["Services"] as string) || "Other"))
      .map(([k, systems]) => [
        k,
        systems.map((s) => ({ name: sanitizeName(getSystemDisplayName(s)), code: getSystemCodeFor(s) })),
      ]),
  );

  const featureGroups = Object.fromEntries(
    Object.entries(groupByKey(validSelectedSiteFeatures, (f) => (f["Category"] as string) || "Other"))
      .map(([k, features]) => [
        k,
        features.map((f) => ({ name: sanitizeName(getSiteFeatureDisplayName(f)), code: getFeatureKeyFor(f) })),
      ]),
  );

  return (
    <div className="space-y-4">
      <h2 className="heading-card">{t("summary.heading")}</h2>

      <div className="border-border border-l-primary rounded-lg border border-l-4 p-4">
        <SectionHeader
          title={t("summary.section.project")}
          editTo="/flow/intake"
          editLabel={t("summary.editProject")}
        />
        {hasIntakeData ? (
          <ProjectInformation intake={intakeForm} />
        ) : (
          <p className="body-muted">{t("summary.empty.project")}</p>
        )}
      </div>

      <div className="border-border border-l-primary rounded-lg border border-l-4 p-4">
        <SectionHeader
          title={t("summary.section.location")}
          editTo="/flow/intake"
          editLabel={t("summary.editProject")}
        />
        {humanAddress || geoData ? (
          <div className="flex items-start gap-2">
            <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-foreground text-sm">{humanAddress || "N/A"}</p>
              {geoData && (
                <p className="text-warm-brown mt-0.5 font-mono text-xs">
                  {formatLatLong(geoData.lat, geoData.lng)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="body-muted">{t("summary.empty.location")}</p>
        )}
      </div>

      <div className="border-border border-l-primary rounded-lg border border-l-4 p-4">
        <SectionHeader
          title={
            validSelectedSystems.length > 0
              ? t("summary.section.systemsCount", {
                  count: validSelectedSystems.length,
                })
              : t("summary.section.systems")
          }
          editTo="/flow/selectedSystems#systems"
          editLabel={t("summary.editSystems")}
        />
        {validSelectedSystems.length === 0 ? (
          <p className="body-muted">{t("summary.empty.systems")}</p>
        ) : (
          <ServicePillList groups={systemGroups} />
        )}
      </div>

      <div className="border-border border-l-primary rounded-lg border border-l-4 p-4">
        <SectionHeader
          title={
            validSelectedSiteFeatures.length > 0
              ? t("summary.section.featuresCount", {
                  count: validSelectedSiteFeatures.length,
                })
              : t("summary.section.features")
          }
          editTo="/flow/selectedSystems#site-features"
          editLabel={t("summary.editFeatures")}
        />
        {validSelectedSiteFeatures.length === 0 ? (
          <p className="body-muted">{t("summary.empty.features")}</p>
        ) : (
          <ServicePillList groups={featureGroups} />
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
