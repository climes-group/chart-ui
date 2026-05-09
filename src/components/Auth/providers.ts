import GoogleProvider from "./GoogleProvider";
import MicrosoftProvider from "./MicrosoftProvider";

export const LOGIN_PROVIDERS = [
  { id: "google", name: "Google", Component: GoogleProvider },
  { id: "microsoft", name: "Microsoft", Component: MicrosoftProvider },
] as const;
