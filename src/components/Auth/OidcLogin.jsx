import { GoogleLogin } from "@react-oauth/google";
import { logout as logoutAction, setProfile, setToken } from "@/state/slices/userReducer";
import { useDispatch, useSelector } from "react-redux";
import AccountControls from "./AccountControls";

function decodeJwt(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
}

function OidcLogin() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);

  const handleSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential;
    const claims = decodeJwt(idToken);
    dispatch(setProfile(claims));
    dispatch(setToken(idToken));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  if (profile) {
    return <AccountControls logout={logout} />;
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}
export default OidcLogin;
