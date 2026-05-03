import useMedia from "@/hooks/useMedia";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, vi } from "vitest";
import SelectedLocation from "../SelectedLocation";

vi.mock("@/hooks/useMedia");
vi.mock("@/components/Map/MapView", () => ({ default: () => <div data-testid="map-view" /> }));

const mockGeoData = { lat: 49.2827, lng: -123.1207 };

describe("SelectedLocation tests", () => {
  it("renders nothing when no data is provided", () => {
    useMedia.mockReturnValue([false]);
    const { container } = render(<SelectedLocation />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders address and coordinates labels when data is present", () => {
    useMedia.mockReturnValue([false]);
    const { getByText } = render(
      <SelectedLocation humanAddr="123 Main St" geoData={mockGeoData} />,
    );
    expect(getByText("Address")).toBeInTheDocument();
    expect(getByText("Coordinates")).toBeInTheDocument();
  });

  it("displays the human address", () => {
    useMedia.mockReturnValue([false]);
    const { getByText } = render(
      <SelectedLocation humanAddr="123 Main St" geoData={mockGeoData} />,
    );
    expect(getByText("123 Main St")).toBeInTheDocument();
  });

  it("shows dash for address when only geoData is provided", () => {
    useMedia.mockReturnValue([false]);
    const { getByText } = render(<SelectedLocation geoData={mockGeoData} />);
    expect(getByText("—")).toBeInTheDocument();
  });

  it("renders the map view", () => {
    useMedia.mockReturnValue([false]);
    const { getByTestId } = render(
      <SelectedLocation humanAddr="123 Main St" geoData={mockGeoData} />,
    );
    expect(getByTestId("map-view")).toBeInTheDocument();
  });

  it("renders in mobile view", () => {
    useMedia.mockReturnValue([true]);
    const { getByText } = render(
      <SelectedLocation humanAddr="123 Main St" geoData={mockGeoData} />,
    );
    expect(getByText("123 Main St")).toBeInTheDocument();
  });

  it("has no axe violations on desktop", async () => {
    useMedia.mockReturnValue([false]);
    const { container } = render(
      <SelectedLocation humanAddr="123 Main St" geoData={mockGeoData} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations on mobile", async () => {
    useMedia.mockReturnValue([true]);
    const { container } = render(
      <SelectedLocation humanAddr="123 Main St" geoData={mockGeoData} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
