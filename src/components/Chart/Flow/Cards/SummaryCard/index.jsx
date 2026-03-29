import { cn } from "@/lib/utils";
import { MapPin, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { formatLatLong } from "./utils";

function sanitizeName(name) {
  if (!name) return "N/A";
  return name.replace(/_/g, " ");
}

function SectionHeader({ title, editTo, editLabel }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="heading-section">{title}</h3>
      <Link
        to={editTo}
        aria-label={editLabel}
        title={editLabel}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-moss-primary transition-colors"
      >
        <Pencil className="size-3" />
        Edit
      </Link>
    </div>
  );
}

function SystemPill({ name }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-moss-primary bg-moss-primary/5 text-sm text-moss-primary font-medium">
      {name}
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

  // Parse system key strings: "Service-Classification-ASTMName-ASTMSystemName"
  const parsedSystems = (selectedSystems || []).map((key) => {
    const [service, classification, astmName, astmSystemName] = key.split("-");
    return { service, classification, astmName, astmSystemName, key };
  });

  // Group by service, sorted alphabetically
  const systemsByService = parsedSystems.reduce((acc, s) => {
    if (!acc[s.service]) acc[s.service] = [];
    acc[s.service].push(s);
    return acc;
  }, {});
  const services = Object.keys(systemsByService).sort();

  return (
    <div className="space-y-4">
      <h2 className="heading-card">Summary</h2>

      {/* Project Information */}
      <div className="rounded-lg border border-border border-l-2 border-l-golden-accent p-4">
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
      <div className="rounded-lg border border-border border-l-2 border-l-moss-primary p-4">
        <SectionHeader
          title="Site Location"
          editTo="/flow/siteLocation"
          editLabel="Edit site location"
        />
        {humanAddress || geoData ? (
          <div className="flex items-start gap-2">
            <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-foreground">{humanAddress || "N/A"}</p>
              {geoData && (
                <p className="text-xs text-warm-brown font-mono mt-0.5">
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
      <div className="rounded-lg border border-border border-l-2 border-l-teal-deep p-4">
        <SectionHeader
          title={
            parsedSystems.length > 0
              ? `Selected Systems (${parsedSystems.length})`
              : "Selected Systems"
          }
          editTo="/flow/applicableSystems"
          editLabel="Edit selected systems"
        />
        {parsedSystems.length === 0 ? (
          <p className="body-muted">No systems selected.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service}>
                <p className="heading-label mb-2">{sanitizeName(service)}</p>
                <div className="flex flex-wrap gap-2">
                  {systemsByService[service].map((s) => (
                    <SystemPill
                      key={s.key}
                      name={sanitizeName(
                        s.astmSystemName || s.astmName || s.classification,
                      )}
                    />
                  ))}
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
