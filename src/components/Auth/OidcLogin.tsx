import AccountControls from "./AccountControls";
import LoginButton from "./LoginButton";
import { useAuth } from "./useAuth";

function OidcLogin() {
  const { profile, onIdToken, logout } = useAuth();

  if (profile) {
    return <AccountControls logout={logout} />;
  }
  return (
    <LoginButton
      onIdToken={(t) => {
        if (t) onIdToken(t);
      }}
    />
  );
}

export default OidcLogin;
