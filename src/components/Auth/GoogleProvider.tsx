import {
  setAuthProvider,
  setProfile,
  setToken,
} from "@/state/slices/userReducer";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { LoginProviderComponent } from "./providers";

export default function GoogleButtonComponent({
  onSuccess = () => {},
  onError,
  disabled,
}: Readonly<LoginProviderComponent>) {
  const dispatch = useDispatch();

  return (
    <GoogleLogin
      onSuccess={(response) => {
        const idToken = response.credential; // Google ID token (JWT)

        if (!idToken) {
          onError?.(new Error("Google did not return an ID token"));
          return;
        }

        // Decode profile from ID token
        const payload = JSON.parse(atob(idToken.split(".")[1]));

        dispatch(setAuthProvider("google"));
        dispatch(setToken(idToken));
        dispatch(setProfile(payload));

        onSuccess();
      }}
      onError={() => onError?.(new Error("Google login failed"))}
      size="large"
      theme="outline"
      shape="rectangular"
      useOneTap={false}
    />
  );
}
