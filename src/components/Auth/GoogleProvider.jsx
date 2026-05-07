import { GoogleLogin } from "@react-oauth/google";

function GoogleProvider({ onSuccess, onError }) {
  return (
    <GoogleLogin
      onSuccess={(response) => onSuccess?.(response.credential)}
      onError={() => onError?.(new Error("Google login failed"))}
    />
  );
}

export default GoogleProvider;
