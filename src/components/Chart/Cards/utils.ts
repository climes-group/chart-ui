import type { FeatureRecord, SystemRecord } from "@/state/slices/reportReducer";

export function sanitizeName(name: string | null | undefined): string {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replaceAll("_", " ");
}

export function getDescription(
  record: SystemRecord | FeatureRecord,
  locale: string,
): string {
  const description =
    (locale === "fr-CA"
      ? (record["DescriptionFr"] as string)
      : (record["Description"] as string)) || (record["Description"] as string);
  return description ?? "";
}
