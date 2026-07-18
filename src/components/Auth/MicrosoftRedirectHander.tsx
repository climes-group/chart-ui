import {
  setAuthProvider,
  setProfile,
  setToken,
} from "@/state/slices/userReducer";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const MICROSOFT_SCOPES = ["openid", "profile", "email", "User.Read"];

export function MicrosoftRedirectHandler() {
  const { instance, accounts } = useMsal();
  const dispatch = useDispatch();

  useEffect(() => {
    instance.handleRedirectPromise().then(async (response) => {
      const account = response?.account || accounts[0];
      if (!account) return;

      const tokenResponse = await instance.acquireTokenSilent({
        scopes: MICROSOFT_SCOPES,
        account,
      });

      const graphRes = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });

      const profile = await graphRes.json();
      dispatch(
        setProfile({
          given_name: profile.givenName,
          email: profile.mail ?? profile.userPrincipalName,
        }),
      );
      dispatch(setAuthProvider("msal"));
      dispatch(setToken(tokenResponse.idToken));
    });
  }, [instance, accounts, dispatch]);

  return null;
}
