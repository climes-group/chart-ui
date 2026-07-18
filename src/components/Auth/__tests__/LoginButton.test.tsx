import { renderWithProviders } from "@/utils/testing";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginButton from "../LoginButton";

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: ({
    onSuccess,
  }: {
    onSuccess: (r: { credential: string }) => void;
  }) => (
    <button
      type="button"
      data-testid="google-login-mock"
      onClick={() => onSuccess({ credential: "mock-credential" })}
    >
      Sign in with Google
    </button>
  ),
}));

const msalLoginPopup = vi.fn();
vi.mock("@azure/msal-react", () => ({
  useMsal: () => ({ instance: { loginPopup: msalLoginPopup } }),
}));

describe("LoginButton tests", () => {
  beforeEach(() => {
    msalLoginPopup.mockReset();
  });

  it("renders the login button", async () => {
    renderWithProviders(<LoginButton />);
    expect(
      await screen.findByRole("button", { name: "Login" }),
    ).toBeInTheDocument();
  });

  it("opens the login modal on click", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginButton />);

    const trigger = await screen.findByRole("button", { name: "Login" });
    await user.click(trigger);

    expect(store.getState().user.loginModalOpen).toBe(true);
  });
});
