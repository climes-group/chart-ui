import { MapPin, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectedSystemCode } from "@/state/slices/reportReducer";
import { formatLatLong } from "./utils";

function sanitizeName(name) {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replace(/_/g, " ");
}

function getSystemDisplayName(system) {
  return system["ASTM.Name"] || system["Classification"];
}

function SectionHeader({ title, editTo, editLabel }) {
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
        Edit
      </Link>
    </div>
  );
}

function SystemPill({ name, code }) {
  return (
    <span className="border-teal-deep bg-teal-deep/10 text-teal-deep inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm font-medium">
      <span>{name}</span>
      {code && (
        <span className="text-warm-brown font-mono text-xs">{code}</span>
      )}
    </span>
  );
}

function SummaryCard() {
  const selectedSystems = useSelector((state) => state.report.selectedSystems);
  const { geoData, humanAddress } = useSelector((state) => state.geo);
  const intakeForm = useSelector((state) => state.report.intakeForm);

  const hasIntakeData =
    intakeForm &&
    Object.values(intakeForm).some((v) =>
      Array.isArray(v) ? v.length > 0 : v !== "",
    );

  const validSelectedSystems = (selectedSystems || []).filter(
    (s) => s && typeof s === "object" && selectedSystemCode(s),
  );

  const systemsByService = validSelectedSystems.reduce((acc, s) => {
    const service = s["Services"] || "Other";
    if (!acc[service]) acc[service] = [];
    acc[service].push(s);
    return acc;
  }, {});
  const services = Object.keys(systemsByService).sort();

  return (
    <div className="space-y-4">
      <h2 className="heading-card">Summary</h2>

      {/* Project Information */}
      <div className="border-border border-l-primary rounded-lg border border-l-4 p-4">
        <SectionHeader
          title="Project Information"
          editTo="/flow/intake"
          editLabel="Edit project information"
        />
        {hasIntakeData ? (
          <p className="body-muted">TBD</p>
        ) : (
          <p className="body-muted">No project information entered.</p>
        )}
      </div>

      {/* Site Location */}
      <div className="border-border border-l-primary rounded-lg border border-l-4 p-4">
        <SectionHeader
          title="Site Location"
          editTo="/flow/intake"
          editLabel="Edit project information"
        />
        {humanAddress || geoData ? (
          <div className="flex items-start gap-2">
            <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-foreground text-sm">{humanAddress || "N/A"}</p>
              {geoData && (
                <p className="text-warm-brown mt-0.5 font-mono text-xs">
                  {formatLatLong(geoData?.lat, geoData?.lng)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="body-muted">No site selected.</p>
        )}
      </div>

      {/* Selected Systems */}
      <div className="border-border border-l-primary rounded-lg border border-l-4 p-4">
        <SectionHeader
          title={
            validSelectedSystems.length > 0
              ? `Selected Systems (${validSelectedSystems.length})`
              : "Selected Systems"
          }
          editTo="/flow/applicableSystems"
          editLabel="Edit selected systems"
        />
        {validSelectedSystems.length === 0 ? (
          <p className="body-muted">No systems selected.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service}>
                <p className="heading-label mb-2">{sanitizeName(service)}</p>
                <div className="flex flex-wrap gap-2">
                  {systemsByService[service].map((s) => {
                    const code = selectedSystemCode(s);
                    return (
                      <SystemPill
                        key={code}
                        name={sanitizeName(getSystemDisplayName(s))}
                        code={code}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
