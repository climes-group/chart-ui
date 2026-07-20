import { logout as logoutAction } from "@/state/slices/userReducer";
import type { RootState } from "@/state/store";
import { useMsal } from "@azure/msal-react";
import { useDispatch, useSelector } from "react-redux";

export function useAuth() {
  const dispatch = useDispatch();
  const { instance } = useMsal();
  const profile = useSelector((state: RootState) => state.user.profile);
  const token = useSelector((state: RootState) => state.user.token);
  const authProvider = useSelector(
    (state: RootState) => state.user.authProvider,
  );

  const logout = () => {
    dispatch(logoutAction());

    // Microsoft logout
    if (authProvider === "msal") {
      instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    }
  };

  return {
    profile,
    token,
    isAuthenticated: Boolean(profile),
    logout,
  };
}
