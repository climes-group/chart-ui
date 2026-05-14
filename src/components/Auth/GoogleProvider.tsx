import { GoogleLogin } from "@react-oauth/google";

type Props = {
  onSuccess?: (idToken: string | undefined) => void;
  onError?: (err: Error) => void;
};

function GoogleProvider({ onSuccess, onError }: Readonly<Props>) {
  return (
    <GoogleLogin
      onSuccess={(response) => onSuccess?.(response.credential)}
      onError={() => onError?.(new Error("Google login failed"))}
    />
  );
}

export default GoogleProvider;
