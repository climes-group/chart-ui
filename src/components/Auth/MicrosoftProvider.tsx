import { useTranslation } from "@/i18n";
import { useMsal } from "@azure/msal-react";
import { LoginProviderComponent } from "./providers";

const MICROSOFT_SCOPES = ["openid", "profile", "email", "User.Read"];

function MicrosoftLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

function MicrosoftProvider({
  onSuccess,
  onError,
  disabled,
}: Readonly<LoginProviderComponent>) {
  const { instance } = useMsal();
  const { t } = useTranslation();
  const label = t("auth.signInWith", { provider: "Microsoft" });

  const handleClick = () => {
    try {
      instance.loginRedirect({ scopes: MICROSOFT_SCOPES });
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="focus-visible:ring-ring inline-flex w-full items-center justify-between gap-3 rounded-sm border border-1 border-[#8c8c8c] p-3 text-sm font-medium shadow-sm transition-colors hover:bg-[#f5f5f5] focus-visible:ring-1 focus-visible:outline-none disabled:opacity-50"
    >
      <MicrosoftLogo />
      <span className="flex-grow">{label}</span>
    </button>
  );
}

export default MicrosoftProvider;
