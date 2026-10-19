import { MapPin } from "lucide-react";
import { useSelector } from "react-redux";

import { useTranslation } from "@/i18n";
import { getFeatureKeyFor, getSystemCodeFor } from "@/state/slices/reportReducer";
import type { RootState } from "@/state/store";
import { getDescription, sanitizeName } from "../utils";
import ProjectInformation from "./ProjectInformation";
import SectionHeader from "./SectionHeader";
import ServicePillList from "./ServicePillList";
import { formatLatLong, groupByKey } from "./utils";

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
    Object.values(intakeForm).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== "",
    );

  const validSelectedSystems = (selectedSystems || []).filter(
    (system) => system && typeof system === "object" && getSystemCodeFor(system),
  );

  const validSelectedSiteFeatures = (selectedSiteFeatures || []).filter(
    (feature) =>
      feature && typeof feature === "object" && getFeatureKeyFor(feature),
  );

  const systemGroups = Object.fromEntries(
    Object.entries(
      groupByKey(
        validSelectedSystems,
        (system) => (system["Services"] as string) || "Other",
      ),
    ).map(([service, systems]) => [
      service,
      systems.map((system) => ({
        name: sanitizeName(system["ASTM.System.Name"] as string),
        description: getDescription(system, locale as string),
      })),
    ]),
  );

  const featureGroups = Object.fromEntries(
    Object.entries(
      groupByKey(
        validSelectedSiteFeatures,
        (feature) => (feature["Category"] as string) || "Other",
      ),
    ).map(([category, features]) => [
      category,
      features.map((feature) => ({
        name: sanitizeName(feature["Site.Feature.Name"] as string),
        description: getDescription(feature, locale as string),
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
