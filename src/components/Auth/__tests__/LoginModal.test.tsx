import { setLoginModalOpen } from "@/state/slices/userReducer";
import { renderWithProviders } from "@/utils/testing";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import LoginModal from "../LoginModal";

describe("LoginModal", () => {
  it("labels the dialog and traps keyboard focus within its controls", async () => {
    const user = userEvent.setup();
    const { container, store } = renderWithProviders(
      <>
        <button
          type="button"
          onClick={() => store.dispatch(setLoginModalOpen(true))}
        >
          Open login
        </button>
        <LoginModal>
          <button type="button">Sign in with Google</button>
        </LoginModal>
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Open login" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Login" });
    const closeButton = within(dialog).getByRole("button", {
      name: "Close login dialog",
    });
    const providerButton = within(dialog).getByRole("button", {
      name: "Sign in with Google",
    });
    const descriptionId = dialog.getAttribute("aria-describedby");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId ?? "")).toHaveTextContent(
      "Choose a sign-in method",
    );
    expect(await axe(container)).toHaveNoViolations();
    await waitFor(() => expect(dialog).toHaveFocus());

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(providerButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <>
        <button
          type="button"
          onClick={() => store.dispatch(setLoginModalOpen(true))}
        >
          Open login
        </button>
        <LoginModal>
          <button type="button">Sign in with Google</button>
        </LoginModal>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Open login" }));

    const dialog = await screen.findByRole("dialog", { name: "Login" });
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Login" })).toBeNull();
      expect(store.getState().user.loginModalOpen).toBe(false);
    });
    expect(dialog).not.toBeInTheDocument();
  });
});
