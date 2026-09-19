import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
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
    <Button
      variant="outline"
      size="lg"
      onClick={handleClick}
      disabled={disabled}
      className="w-full justify-between"
    >
      <MicrosoftLogo />
      <span className="flex-grow">{label}</span>
    </Button>
  );
}

export default MicrosoftProvider;
