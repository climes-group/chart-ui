import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, vi } from "vitest";
import { store } from "../../../../../state/store.js";
import { GeoCode } from "../../../../../utils/geocode.js";
import SiteLocationCard from "../SiteLocationCard";

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
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
});
