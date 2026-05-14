import { renderWithProviders } from "@/utils/testing";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SavedReports from "../index";

const loggedInState = {
  user: { profile: { email: "user@example.com" }, token: "test-token" },
};

type FetchResponseLike = { ok: boolean; status?: number; json: () => Promise<unknown> };

function mockListReports(reports: unknown[]) {
  return vi.fn<typeof fetch>().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: reports }),
  } as unknown as Response);
}

function mockDeleteAllOk(): FetchResponseLike {
  return { ok: true, json: () => Promise.resolve({}) };
}

type Handler = (() => FetchResponseLike) | FetchResponseLike;

function mockFetchSequence(handlers: Handler[]) {
  let call = 0;
  return vi.fn<typeof fetch>(() => {
    const handler = handlers[call] ?? handlers.at(-1);
    call += 1;
    return Promise.resolve(
      typeof handler === "function" ? handler() : handler,
    ) as Promise<Response>;
  });
}

describe("SavedReports", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });
  });

  it("redirects to home when the user is not logged in", () => {
    renderWithProviders(<SavedReports />, {
      preloadedState: { user: { profile: undefined, token: undefined } },
    });
    expect(screen.queryByText("Saved Reports")).not.toBeInTheDocument();
  });

  it("shows the loading state while fetching", () => {
    globalThis.fetch = vi.fn<typeof fetch>(() => new Promise<Response>(() => {}));
    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });
    expect(screen.getByText(/Loading reports/)).toBeInTheDocument();
  });

  it("shows the empty state and hides 'Delete all reports' when there are no reports", async () => {
    globalThis.fetch = mockListReports([]);
    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });

    expect(await screen.findByText(/No saved reports found/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Delete all reports/ }),
    ).not.toBeInTheDocument();
  });

  it("shows reports and the 'Delete all reports' button when reports exist", async () => {
    globalThis.fetch = mockListReports([
      { name: "report-1.pdf", created: "2026-04-01T10:00:00Z" },
      { name: "report-2.pdf", created: "2026-04-02T10:00:00Z" },
    ]);
    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });

    expect(await screen.findByText("report-1.pdf")).toBeInTheDocument();
    expect(screen.getByText("report-2.pdf")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Delete all reports/ }),
    ).toBeInTheDocument();
  });

  it("shows the load-error state on fetch failure", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });

    expect(
      await screen.findByText(/Failed to load reports/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Delete all reports/ }),
    ).not.toBeInTheDocument();
  });

  it("opens the delete-all confirmation with the correct count", async () => {
    globalThis.fetch = mockListReports([
      { name: "a.pdf", created: "2026-04-01T10:00:00Z" },
      { name: "b.pdf", created: "2026-04-02T10:00:00Z" },
      { name: "c.pdf", created: "2026-04-03T10:00:00Z" },
    ]);
    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });

    await userEvent.click(
      await screen.findByRole("button", { name: /Delete all reports/ }),
    );

    const dialog = screen.getByRole("dialog", { name: /Delete all reports/ });
    expect(within(dialog).getByText("3")).toBeInTheDocument();
    expect(
      within(dialog).getByText(/saved reports\. This action cannot be undone/),
    ).toBeInTheDocument();
  });

  it("cancelling the delete-all dialog leaves the list intact and fires no request", async () => {
    globalThis.fetch = mockListReports([
      { name: "a.pdf", created: "2026-04-01T10:00:00Z" },
    ]);
    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });

    await userEvent.click(
      await screen.findByRole("button", { name: /Delete all reports/ }),
    );

    const dialog = screen.getByRole("dialog", { name: /Delete all reports/ });
    const initialCallCount = vi.mocked(globalThis.fetch).mock.calls.length;

    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("dialog", { name: /Delete all reports/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("a.pdf")).toBeInTheDocument();
    expect(vi.mocked(globalThis.fetch).mock.calls.length).toBe(initialCallCount);
  });

  it("confirming sends POST to /reports/delete_all and clears the list", async () => {
    globalThis.fetch = mockFetchSequence([
      () => ({ ok: true, json: () => Promise.resolve({ data: [{ name: "a.pdf", created: "2026-04-01T10:00:00Z" }] }) }),
      () => mockDeleteAllOk(),
    ]);

    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });

    await userEvent.click(
      await screen.findByRole("button", { name: /Delete all reports/ }),
    );
    const dialog = screen.getByRole("dialog", { name: /Delete all reports/ });
    await userEvent.click(
      within(dialog).getByRole("button", { name: /Delete all/ }),
    );

    await waitFor(() =>
      expect(screen.getByText(/No saved reports found/)).toBeInTheDocument(),
    );
    expect(
      screen.queryByRole("button", { name: /Delete all reports/ }),
    ).not.toBeInTheDocument();

    const lastCall = vi.mocked(globalThis.fetch).mock.calls.at(-1)!;
    expect(lastCall[0]).toMatch(/\/reports\/delete_all$/);
    expect(lastCall[1]).toMatchObject({
      method: "POST",
      headers: { "X-ID-Token": "Bearer test-token" },
    });
  });

  it("shows an inline error and keeps the list when delete-all fails", async () => {
    globalThis.fetch = mockFetchSequence([
      () => ({ ok: true, json: () => Promise.resolve({ data: [{ name: "a.pdf", created: "2026-04-01T10:00:00Z" }] }) }),
      () => ({ ok: false, status: 500, json: () => Promise.resolve({}) }),
    ]);

    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });

    await userEvent.click(
      await screen.findByRole("button", { name: /Delete all reports/ }),
    );
    const dialog = screen.getByRole("dialog", { name: /Delete all reports/ });
    await userEvent.click(
      within(dialog).getByRole("button", { name: /Delete all/ }),
    );

    expect(
      await screen.findByText(/Failed to delete all reports/),
    ).toBeInTheDocument();
    expect(screen.getByText("a.pdf")).toBeInTheDocument();
  });

  it("opening the per-report delete dialog shows the filename and is independent of delete-all", async () => {
    globalThis.fetch = mockListReports([
      { name: "only.pdf", created: "2026-04-01T10:00:00Z" },
    ]);
    renderWithProviders(<SavedReports />, { preloadedState: loggedInState });

    await userEvent.click(
      await screen.findByRole("button", { name: /^Delete$/ }),
    );

    const dialog = screen.getByRole("dialog", { name: /Delete report/ });
    expect(within(dialog).getByText("only.pdf")).toBeInTheDocument();
  });

  it("has no axe violations in the loading state", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(() => new Promise<Response>(() => {}));
    const { container } = renderWithProviders(<SavedReports />, {
      preloadedState: loggedInState,
    });
    await screen.findByText(/Loading reports/);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in the empty state", async () => {
    globalThis.fetch = mockListReports([]);
    const { container } = renderWithProviders(<SavedReports />, {
      preloadedState: loggedInState,
    });
    await screen.findByText(/No saved reports found/);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in the ready state", async () => {
    globalThis.fetch = mockListReports([
      { name: "report-1.pdf", created: "2026-04-01T10:00:00Z" },
      { name: "report-2.pdf", created: "2026-04-02T10:00:00Z" },
    ]);
    const { container } = renderWithProviders(<SavedReports />, {
      preloadedState: loggedInState,
    });
    await screen.findByText("report-1.pdf");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in the error state", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    const { container } = renderWithProviders(<SavedReports />, {
      preloadedState: loggedInState,
    });
    await screen.findByText(/Failed to load reports/);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when the delete-all dialog is open", async () => {
    globalThis.fetch = mockListReports([
      { name: "a.pdf", created: "2026-04-01T10:00:00Z" },
    ]);
    const { container } = renderWithProviders(<SavedReports />, {
      preloadedState: loggedInState,
    });
    await userEvent.click(
      await screen.findByRole("button", { name: /Delete all reports/ }),
    );
    await screen.findByRole("dialog", { name: /Delete all reports/ });
    expect(await axe(container)).toHaveNoViolations();
  });
});
