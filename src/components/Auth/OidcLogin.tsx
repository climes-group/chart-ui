import AccountControls from "./AccountControls";
import LoginButton from "./LoginButton";
import LoginModal from "./LoginModal";
import { MicrosoftRedirectHandler } from "./MicrosoftRedirectHander";
import { LOGIN_PROVIDERS } from "./providers";
import { useAuth } from "./useAuth";

function OidcLogin() {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return <AccountControls logout={logout} />;
  }
  return (
    <>
      <MicrosoftRedirectHandler />
      <LoginButton />
      <LoginModal>
        <p>To continue, please choose a login provider:</p>
        <div className="flex flex-col gap-3">
          {LOGIN_PROVIDERS.map(({ id, name, Component, disabled }) => (
            <Component
              key={id}
              onSuccess={() => {}}
              onError={(err) => console.log(`${name} login failed`, err)}
              disabled={disabled}
            />
          ))}
        </div>
      </LoginModal>
    </>
  );
}

export default OidcLogin;
