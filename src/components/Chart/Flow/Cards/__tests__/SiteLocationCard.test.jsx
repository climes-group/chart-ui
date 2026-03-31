import { GeoCode } from "@/utils/geocode.js";
import { act, fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, vi } from "vitest";
import { setupTestStore } from "@/state/store.js";
import SiteLocationCard from "../SiteLocationCard";

vi.mock("@/components/Map/MapView", () => ({ default: () => <div data-testid="map-view" /> }));
vi.mock("@/hooks/useMedia", () => ({ default: () => [false] }));

const wrapper = ({ children }) => (
  <Provider store={setupTestStore()}>{children}</Provider>
);

describe("SiteLocationCard tests", () => {
  it("renders the SiteLocationCard component", () => {
    render(<SiteLocationCard />, { wrapper });
  });

  it("uses device location when button is clicked", async () => {
    const mockPosition = {
      coords: { latitude: 44.123456, longitude: -77.123456 },
    };
    const mockGeoCode = new GeoCode(
      mockPosition.coords.latitude,
      mockPosition.coords.longitude,
    );
    global.navigator.geolocation = {
      getCurrentPosition: vi.fn((success) => success(mockPosition)),
    };

    const screen = render(<SiteLocationCard />, { wrapper });
    act(() => {
      screen.getByText("Use my location").click();
    });
    await screen.findByText(mockGeoCode.str);
  });

  it("searches an address and displays the result", async () => {
    global.fetch = vi.fn().mockResolvedValue({
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
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search for an address…"), {
        target: { value: "123 Main St." },
      });
      screen.getByRole("button", { name: "Search" }).click();
    });
  });
});
