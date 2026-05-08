import {
  logout as logoutAction,
  setProfile,
  setToken,
} from "@/state/slices/userReducer";
import { useDispatch, useSelector } from "react-redux";

// Decodes the payload claims from a JWT without verifying the signature.
// base64url uses - and _ instead of + and / — replace before atob.
function decodeJwt(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload.replaceAll(/-/g, "+").replaceAll(/_/g, "/")));
}

export function useAuth() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);

  return {
    profile,
    onIdToken: (idToken) => {
      const claims = decodeJwt(idToken);
      dispatch(setProfile(claims));
      dispatch(setToken(idToken));
    },
    logout: () => dispatch(logoutAction()),
  };
}
