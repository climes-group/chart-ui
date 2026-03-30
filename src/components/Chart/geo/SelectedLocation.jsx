import useMedia from "@/hooks/useMedia";
import { GeoCode } from "@/utils/geocode";
import MapView from "@/components/Chart/Map/MapView";

function SelectedLocation({ humanAddr, geoData }) {
  const [isSmallDevice] = useMedia();

  if (!geoData && !humanAddr) {
    return null;
  }

  const geoCode = geoData ? new GeoCode(geoData.lat, geoData.lng) : null;

  const summaryBlock = (
    <div className="rounded-lg border border-golden-accent/50 bg-background p-4 space-y-3">
      <p className="heading-label">
        Selected location
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Address</p>
          <p className="text-foreground font-medium">
            {humanAddr || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">
            Coordinates
          </p>
          <p className="text-warm-brown font-mono text-xs">
            {geoCode ? geoCode.str : "—"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-6 border-t border-golden-accent/30 space-y-4">
      {summaryBlock}
      <div
        className={
          isSmallDevice
            ? "rounded-lg overflow-hidden"
            : "rounded-lg overflow-hidden border border-border"
        }
      >
        <MapView geoData={geoData} />
      </div>
    </div>
  );
}

export default SelectedLocation;
