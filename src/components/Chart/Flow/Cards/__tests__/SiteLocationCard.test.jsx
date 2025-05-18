import { GeoCode } from "@/utils/geocode.js";
import { act, fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, vi } from "vitest";
import { setupStore } from "../../../../../state/store.js";
import SiteLocationCard from "../SiteLocationCard";

const wrapper = ({ children }) => (
  <Provider store={setupStore()}>{children}</Provider>
);
vi.mock("react-redux", { spy: true });

describe("SiteLocationCard tests", () => {
  it("should render the SiteLocationCard component", () => {
    // test code here
    render(<SiteLocationCard />, { wrapper });
  });

  it("should use device location", async () => {
    // mock navigator.geolocation
    const mockGeolocation = {
      getCurrentPosition: vi.fn(),
    };
    global.navigator.geolocation = mockGeolocation;

    const mockPosition = {
      coords: {
        latitude: 44.123456,
        longitude: -77.123456,
      },
    };
    const mockGeoCode = new GeoCode(
      mockPosition.coords.latitude,
      mockPosition.coords.longitude,
    );
    mockGeolocation.getCurrentPosition.mockImplementation((success) =>
      success(mockPosition),
    );

    const screen = render(<SiteLocationCard />, { wrapper });
    act(() => {
      screen.getByText("Use my location").click();
    });
    await screen.findByText(mockGeoCode.str);
  });

  it("should search an address and then choose it", async () => {
    // mock fetch
    global.fetch = vi.fn();
    fetch.mockResolvedValue({
      json: async () => ({
        items: [
          {
            address: {
              label:
                "1600 Amphitheatre Pkwy, Mountain View, California, 94043, United States",
            },
          },
        ],
      }),
    });

    const screen = render(<SiteLocationCard />, { wrapper });
    act(() => {
      // find address text field and change value
      const addressField = screen.getByLabelText("Address");
      fireEvent.change(addressField, {
        target: { value: "1600 Amphitheatre Parkway, Mountain View, CA" },
      });
      screen.getByText("Search").click();
    });

    // wait for search results
    await screen.findByText("1 result(s) found.");

    // click radio button
    act(() => {
      screen
        .getByText(
          "1600 Amphitheatre Pkwy, Mountain View, California, 94043, United States",
        )
        .click();
    });
  });
});
