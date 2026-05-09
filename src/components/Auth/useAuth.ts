import {
  logout as logoutAction,
  setProfile,
  setToken,
  type UserProfile,
} from "@/state/slices/userReducer";
import type { RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";

// Decodes the payload claims from a JWT without verifying the signature.
// base64url uses - and _ instead of + and / — replace before atob.
function decodeJwt(token: string): UserProfile {
  const payload = token.split(".")[1];
  return JSON.parse(
    atob(payload.replaceAll(/-/g, "+").replaceAll(/_/g, "/")),
  ) as UserProfile;
}

export function useAuth() {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.user.profile);

  return {
    profile,
    onIdToken: (idToken: string) => {
      const claims = decodeJwt(idToken);
      dispatch(setProfile(claims));
      dispatch(setToken(idToken));
    },
    logout: () => dispatch(logoutAction()),
  };
}
