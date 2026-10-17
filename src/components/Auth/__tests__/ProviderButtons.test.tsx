import { renderWithProviders } from "@/utils/testing";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GoogleProvider from "../GoogleProvider";
import MicrosoftProvider from "../MicrosoftProvider";

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: ({
    type,
    shape,
    size,
  }: {
    type: string;
    shape: string;
    size: string;
  }) => (
    <button
      type="button"
      aria-label="Sign in with Google"
      data-button-type={type}
      data-button-shape={shape}
      data-button-size={size}
    />
  ),
}));

const { loginRedirect } = vi.hoisted(() => ({
  loginRedirect: vi.fn(),
}));

vi.mock("@azure/msal-react", () => ({
  useMsal: () => ({ instance: { loginRedirect } }),
}));

describe("OIDC provider buttons", () => {
  beforeEach(() => {
    loginRedirect.mockReset();
  });

  it("uses Google's official standard sign-in button", () => {
    renderWithProviders(<GoogleProvider />);

    const button = screen.getByRole("button", { name: "Sign in with Google" });
    expect(button).toHaveAttribute("data-button-type", "standard");
    expect(button).toHaveAttribute("data-button-shape", "rectangular");
    expect(button).toHaveAttribute("data-button-size", "large");
  });

  it("renders a labeled Microsoft sign-in button that starts sign-in", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MicrosoftProvider />);

    const button = screen.getByRole("button", {
      name: "Sign in with Microsoft",
    });
    expect(button).toHaveTextContent("Sign in with Microsoft");

    await user.click(button);
    expect(loginRedirect).toHaveBeenCalledWith({
      scopes: ["openid", "profile", "email", "User.Read"],
    });
  });
});
