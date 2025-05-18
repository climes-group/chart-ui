import { render } from "@testing-library/react";
import { describe, vi } from "vitest";
import SelectedLocation from "../SelectedLocation";

import useMedia from "@/hooks/useMedia";
vi.mock("@/hooks/useMedia");

describe("SelectedLocation tests", () => {
  describe("Desktop view", () => {
    it("should render Address text", async () => {
      useMedia.mockReturnValue([false, true]);
      const screen = render(<SelectedLocation />);
      await screen.findByText("Address");
    });
    it("should render Geocode text", async () => {
      const mockGeoData = {
        lat: 123.456,
        lng: 123.456,
      };
      useMedia.mockReturnValue([false, true]);
      const screen = render(<SelectedLocation geoData={mockGeoData} />);
      await screen.findByText("Geo Code");
    });
  });

  it("should render the SelectedLocation component with mobile view", async () => {
    useMedia.mockReturnValue([true, false]);
    const screen = render(<SelectedLocation />);
    // expect Address text to be in the document
    expect(screen.queryByText("Address")).toBeNull();
  });
});
