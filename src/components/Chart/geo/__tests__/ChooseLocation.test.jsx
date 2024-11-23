import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe } from "vitest";
import { searchAddress } from "../../../../utils/geocode";
import ChooseLocation from "../ChooseLocation";

vi.mock("../../../../utils/geocode");

describe("ChooseLocation tests", () => {
  beforeEach(() => {});
  it("should render the ChooseLocation component", () => {
    // test code here
    render(<ChooseLocation />);
  });
  it("should search an address", async () => {
    const onChooseAddr = vi.fn();
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
    searchAddress.mockReturnValueOnce({
      items: [mockAddressResult],
    });

    const screen = render(<ChooseLocation onChooseAddr={onChooseAddr} />);

    // find address text field and change value
    const addressField = screen.getByLabelText("Address");
    fireEvent.change(addressField, {
      target: { value: "123 Main St, Loyalist" },
    });

    // click search
    screen.getByText("Search").click();
    // wait for search results
    await screen.findByText("1 result(s) found.");

    // click on the first result
    screen.getByLabelText("123 Main St, Loyalist").click();

    expect(onChooseAddr).toHaveBeenCalledWith(mockAddressResult);
  });

  it(`should call onUseLocSvc when "Use my location" is clicked`, () => {
    const onUseLocSvc = vi.fn();
    const screen = render(<ChooseLocation onUseLocSvc={onUseLocSvc} />);
    screen.getByText("Use my location").click();
    expect(onUseLocSvc).toHaveBeenCalled();
  });
});
