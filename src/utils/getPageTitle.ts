import type { TranslateFn } from "@/i18n";

const APP_TITLE = "CHART";

export function getPageTitle(pathname: string, t: TranslateFn): string {
  if (pathname === "/") return APP_TITLE;

  if (pathname === "/design") {
    return `${APP_TITLE} — ${t("pageTitle.design")}`;
  }

  if (pathname === "/reports") {
    return `${APP_TITLE} — ${t("savedReports.heading")}`;
  }

  if (pathname === "/flow" || pathname.startsWith("/flow/")) {
    const stepName = pathname.split("/")[2] || "intake";
    const key = stepName === "finish" ? "finish.title" : `steps.${stepName}`;
    const stepTitle = t(key);
    return `${APP_TITLE} — ${stepTitle === key ? t("steps.intake") : stepTitle}`;
  }

  return APP_TITLE;
}
