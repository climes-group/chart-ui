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

  it("should render the ChooseLocation component", () => {
    // test code here
    render(<ChooseLocation />);
  });

  it("should search an address", async () => {
    const onChooseAddr = vi.fn();
    searchAddress.mockReturnValueOnce({
      items: [mockAddressResult],
    });

    const screen = render(<ChooseLocation onChooseAddr={onChooseAddr} />);

    // find address text field and change value
    const addressField = screen.getByLabelText("Address");
    fireEvent.change(addressField, {
      target: { value: "123 Main St, Loyalist" },
    });

    act(() => {
      // click search
      screen.getByText("Search").click();
    });

    // wait for search results
    await screen.findByText("1 result(s) found.");

    act(() => {
      // click on the first result
      screen.getByLabelText("123 Main St, Loyalist").click();
    });

    expect(onChooseAddr).toHaveBeenCalledWith(mockAddressResult);
  });

  it("should search address and clear results", async () => {
    const onChooseAddr = vi.fn();
    searchAddress.mockReturnValueOnce({
      items: [mockAddressResult],
    });

    const screen = render(<ChooseLocation onChooseAddr={onChooseAddr} />);

    // find address text field and change value
    const addressField = screen.getByLabelText("Address");
    fireEvent.change(addressField, {
      target: { value: "123 Main St, Loyalist" },
    });

    act(() => {
      // click search
      screen.getByText("Search").click();
    });
    // wait for search results
    await screen.findByText("1 result(s) found.");

    act(() => {
      // click clear
      screen.getByText("Clear").click();
    });

    expect(screen.queryByText("1 result(s) found.")).toBeNull();
  });

  it(`should call onUseLocSvc when "Use my location" is clicked`, () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        items: [],
      }),
    });
    const onUseLocSvc = vi.fn();
    const screen = render(<ChooseLocation onUseLocSvc={onUseLocSvc} />);
    screen.getByText("Use my location").click();
    expect(onUseLocSvc).toHaveBeenCalled();
  });

  it("should render mobile view", () => {
    useMedia.mockReturnValueOnce([true]);
    render(<ChooseLocation />);
  });
});
