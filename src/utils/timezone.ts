/**
 * Get the user's current timezone
 * @returns IANA timezone string (e.g., "America/Vancouver") or "UTC" if detection fails
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn("Failed to detect user timezone, falling back to UTC", error);
    return "UTC";
  }
}
