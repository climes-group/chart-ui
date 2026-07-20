import GoogleProvider from "./GoogleProvider";
import MicrosoftProvider from "./MicrosoftProvider";

export type LoginProviderComponent = {
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
  disabled?: boolean;
};

export type LoginProvider = {
  id: string;
  name: string;
  Component: React.ComponentType<LoginProviderComponent>;
  disabled?: boolean;
};

export const LOGIN_PROVIDERS = [
  { id: "google", name: "Google", Component: GoogleProvider },
  {
    id: "microsoft",
    name: "Microsoft",
    Component: MicrosoftProvider,
  },
] as LoginProvider[];
