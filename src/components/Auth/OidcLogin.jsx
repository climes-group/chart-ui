import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

import { setProfile } from "@/state/slices/userReducer";
import { useDispatch } from "react-redux";
import AccountControls from "./AccountControls";

function OidcLogin() {
  const [user, setUser] = useState(undefined);
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const logout = () => {
    setUser(undefined);
    logout();
  };

  useEffect(() => {
    if (user) {
      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch(setProfile(data));
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return <AccountControls login={login} logout={logout} />;
}
export default OidcLogin;
