import { render } from "@testing-library/react";
import { describe, expect } from "vitest";
import MapView from "../MapView";

describe("MapView tests", () => {
  it("should render the map", () => {
    // test code here
    const screen = render(<MapView />);

    // expect container to be empty div
    expect(screen.container).toMatchInlineSnapshot(`<div />`);
  });

  it("should render the map with geodata", async () => {
    const mockGeoData = {
      lat: 0,
      lng: 0,
    };
    // test code here
    const screen = render(<MapView geoData={mockGeoData} />);

    await screen.findByText("Leaflet");
  });
});
