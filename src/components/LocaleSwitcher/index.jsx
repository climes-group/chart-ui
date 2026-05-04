import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "en-CA", labelKey: "localeSwitcher.en", switchKey: "localeSwitcher.switchToEn" },
  { code: "fr-CA", labelKey: "localeSwitcher.fr", switchKey: "localeSwitcher.switchToFr" },
];

function LocaleSwitcher({ className }) {
  const { locale, setLocale, t } = useTranslation();

  return (
    <nav
      aria-label={t("localeSwitcher.label")}
      className={cn("flex items-center gap-1 text-sm", className)}
    >
      {LOCALES.map((option, idx) => {
        const isActive = option.code === locale;
        return (
          <span key={option.code} className="flex items-center">
            {idx > 0 && (
              <span aria-hidden="true" className="px-1 text-muted-foreground">
                |
              </span>
            )}
            <button
              type="button"
              onClick={() => setLocale(option.code)}
              aria-current={isActive ? "true" : undefined}
              aria-label={t(option.switchKey)}
              disabled={isActive}
              className={cn(
                "px-1 py-0.5 font-medium underline-offset-2",
                isActive
                  ? "text-foreground cursor-default"
                  : "text-muted-foreground hover:text-foreground hover:underline cursor-pointer",
              )}
            >
              {t(option.labelKey)}
            </button>
          </span>
        );
      })}
    </nav>
  );
}

export default LocaleSwitcher;
