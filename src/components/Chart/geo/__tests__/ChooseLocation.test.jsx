import useMedia from "@/hooks/useMedia";
import { searchAddress } from "@/utils/geocode";
import { act, fireEvent, render } from "@testing-library/react";
import { beforeEach, describe } from "vitest";
import ChooseLocation from "../ChooseLocation";

vi.mock("@/utils/geocode");
vi.mock("@/hooks/useMedia");

const mockAddressResult = {
  id: "123",
  title: "123 Main St, Loyal",
  address: {
    label: "123 Main St, Loyalist",
  },
  position: {
    lat: 44.123456,
    lng: -77.123456,
  },
};

describe("ChooseLocation tests", () => {
  beforeEach(() => {
    useMedia.mockReturnValue([false]);
  });

  it("renders the ChooseLocation component", () => {
    render(<ChooseLocation />);
  });

  it("searches an address and selects a result", async () => {
    const onChooseAddr = vi.fn();
    searchAddress.mockReturnValueOnce({
      items: [mockAddressResult],
    });

    const screen = render(<ChooseLocation onChooseAddr={onChooseAddr} />);

    fireEvent.change(screen.getByPlaceholderText("Search for an address…"), {
      target: { value: "123 Main St, Loyalist" },
    });

    act(() => {
      screen.getByRole("button", { name: "Search" }).click();
    });

    await screen.findByText("123 Main St, Loyalist");

    act(() => {
      screen.getByRole("button", { name: "123 Main St, Loyalist" }).click();
    });

    expect(onChooseAddr).toHaveBeenCalledWith(mockAddressResult);
  });

  it("shows no results message when search returns empty", async () => {
    searchAddress.mockReturnValueOnce({ items: [] });

    const screen = render(<ChooseLocation />);

    fireEvent.change(screen.getByPlaceholderText("Search for an address…"), {
      target: { value: "nowhere" },
    });

    act(() => {
      screen.getByRole("button", { name: "Search" }).click();
    });

    await screen.findByText("No results found.");
  });

  it("clears search results", async () => {
    searchAddress.mockReturnValueOnce({ items: [mockAddressResult] });

    const screen = render(<ChooseLocation />);

    fireEvent.change(screen.getByPlaceholderText("Search for an address…"), {
      target: { value: "123 Main St, Loyalist" },
    });

    act(() => {
      screen.getByRole("button", { name: "Search" }).click();
    });

    await screen.findByText("123 Main St, Loyalist");

    act(() => {
      screen.getByRole("button", { name: "Clear search" }).click();
    });

    expect(screen.queryByText("123 Main St, Loyalist")).toBeNull();
  });

  it(`calls onUseLocSvc when "Use my location" is clicked`, () => {
    const onUseLocSvc = vi.fn();
    const screen = render(<ChooseLocation onUseLocSvc={onUseLocSvc} />);
    screen.getByText("Use my location").click();
    expect(onUseLocSvc).toHaveBeenCalled();
  });

  it("searches on Enter key press", async () => {
    searchAddress.mockReturnValueOnce({ items: [mockAddressResult] });

    const screen = render(<ChooseLocation />);
    const input = screen.getByPlaceholderText("Search for an address…");

    fireEvent.change(input, { target: { value: "123 Main St" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await screen.findByText("123 Main St, Loyalist");
  });

  it("renders mobile view", () => {
    useMedia.mockReturnValueOnce([true]);
    render(<ChooseLocation />);
  });
});
