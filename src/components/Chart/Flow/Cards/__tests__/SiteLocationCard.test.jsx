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

  it.only("should search an address and then choose it", async () => {
    // mock fetch
    global.fetch = vi.fn();
    fetch.mockResolvedValue({
      json: async () => [
        {
          place_id: "123456",
          display_name: "123 Main St.",
          lat: "40.712776",
          lon: "-74.005974",
        },
      ],
    });

    const screen = render(<SiteLocationCard />, { wrapper });
    act(() => {
      // find address text field and change value
      const addressField = screen.getByLabelText(/Search for an address/i);
      fireEvent.change(addressField, {
        target: { value: "123 Main St." },
      });
      screen.getByLabelText("search").click();
    });
  });
});
