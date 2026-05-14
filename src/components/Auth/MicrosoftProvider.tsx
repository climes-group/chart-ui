import { useTranslation } from "@/i18n";
import { useMsal } from "@azure/msal-react";

const MICROSOFT_SCOPES = ["openid", "profile", "email"];

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

type Props = {
  onSuccess?: (idToken: string) => void;
  onError?: (err: unknown) => void;
};

function MicrosoftProvider({ onSuccess, onError }: Readonly<Props>) {
  const { instance } = useMsal();
  const { t } = useTranslation();
  const label = t("auth.signInWith", { provider: "Microsoft" });

  const handleClick = async () => {
    try {
      const response = await instance.loginPopup({ scopes: MICROSOFT_SCOPES });
      if (response?.idToken) {
        onSuccess?.(response.idToken);
      } else {
        onError?.(new Error("No idToken returned"));
      }
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className="inline-flex w-full items-center gap-2 rounded-md border border-[#8c8c8c] bg-white px-3 py-2 text-sm font-medium text-[#5e5e5e] shadow-sm transition-colors hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <MicrosoftLogo />
      <span>{label}</span>
    </button>
  );
}

export default MicrosoftProvider;
