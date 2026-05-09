import { renderWithProviders } from "@/utils/testing";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
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

  it("opens the provider menu on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginButton />);

    const trigger = await screen.findByRole("button", { name: "Login" });
    expect(trigger).not.toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByTestId("google-login-mock")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in with Microsoft" }),
    ).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the menu when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginButton />);

    const trigger = await screen.findByRole("button", { name: "Login" });
    await user.click(trigger);
    await screen.findByRole("menu");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("calls onIdToken with the credential and closes the menu when Google succeeds", async () => {
    const user = userEvent.setup();
    const onIdToken = vi.fn();
    renderWithProviders(<LoginButton onIdToken={onIdToken} />);

    await user.click(await screen.findByRole("button", { name: "Login" }));
    await user.click(screen.getByTestId("google-login-mock"));

    expect(onIdToken).toHaveBeenCalledWith("mock-credential");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("calls onIdToken with the idToken and closes the menu when Microsoft succeeds", async () => {
    const user = userEvent.setup();
    const onIdToken = vi.fn();
    msalLoginPopup.mockResolvedValue({ idToken: "mock-ms-token" });
    renderWithProviders(<LoginButton onIdToken={onIdToken} />);

    await user.click(await screen.findByRole("button", { name: "Login" }));
    await user.click(
      screen.getByRole("button", { name: "Sign in with Microsoft" }),
    );

    await waitFor(() => {
      expect(onIdToken).toHaveBeenCalledWith("mock-ms-token");
    });
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("has no axe violations in the default (closed) state", async () => {
    const { container } = renderWithProviders(<LoginButton />);
    await screen.findByRole("button", { name: "Login" });
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when the provider menu is open", async () => {
    const user = userEvent.setup();
    const { baseElement } = renderWithProviders(<LoginButton />);

    await user.click(await screen.findByRole("button", { name: "Login" }));
    await screen.findByRole("menu");

    expect(
      await axe(baseElement, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
