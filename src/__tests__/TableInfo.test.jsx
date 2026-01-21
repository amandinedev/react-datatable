import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TableInfo from "../../src/components/TableInfo/TableInfo";

describe("TableInfo Component", () => {
  it("renders correct info with multiple items", () => {
    render(<TableInfo totalItems={35} startItem={1} endItem={10} />);

    expect(
      screen.getByText("Showing 1 to 10 of 35 entries"),
    ).toBeInTheDocument();
  });

  it("renders singular entry for one item", () => {
    render(<TableInfo totalItems={1} startItem={1} endItem={1} />);

    expect(screen.getByText("Showing 1 to 1 of 1 entry")).toBeInTheDocument();
  });

  it("shows no data available message for zero items", () => {
    render(<TableInfo totalItems={0} startItem={0} endItem={0} />);

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("handles edge case where startItem > endItem", () => {
    render(<TableInfo totalItems={35} startItem={5} endItem={2} />);

    // Should still render the provided values even if they don't make logical sense
    expect(
      screen.getByText("Showing 5 to 2 of 35 entries"),
    ).toBeInTheDocument();
  });

  it("handles edge case where endItem > totalItems", () => {
    render(<TableInfo totalItems={35} startItem={30} endItem={40} />);

    expect(
      screen.getByText("Showing 30 to 40 of 35 entries"),
    ).toBeInTheDocument();
  });

  it("handles string values for numbers", () => {
    render(<TableInfo totalItems="35" startItem="1" endItem="10" />);

    // The component should handle string numbers correctly
    expect(
      screen.getByText("Showing 1 to 10 of 35 entries"),
    ).toBeInTheDocument();
  });
});
