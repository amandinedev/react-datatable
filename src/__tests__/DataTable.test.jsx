import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataTable from "../components/DataTable/DataTable.jsx";

describe("DataTable Component", () => {
  const mockData = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      department: "Engineering",
      startDate: "2023-01-01",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      department: "Marketing",
      startDate: "2023-02-01",
    },
    {
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      department: "Sales",
      startDate: "2023-03-01",
    },
    {
      id: 4,
      firstName: "Alice",
      lastName: "Williams",
      department: "Engineering",
      startDate: "2023-04-01",
    },
    {
      id: 5,
      firstName: "Charlie",
      lastName: "Brown",
      department: "Marketing",
      startDate: "2023-05-01",
    },
  ];

  const mockColumns = [
    {
      title: "First Name",
      dataKey: "firstName",
      sortable: true,
    },
    {
      title: "Last Name",
      dataKey: "lastName",
      sortable: true,
    },
    {
      title: "Department",
      dataKey: "department",
      sortable: true,
      filterable: true,
    },
    {
      title: "Start Date",
      dataKey: "startDate",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    itemsPerPage: 10,
  };

  it("renders table with correct headers and data", () => {
    render(<DataTable {...defaultProps} />);

    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();

    expect(screen.getByText("Show")).toBeInTheDocument();
    expect(screen.getByText("entries")).toBeInTheDocument();
  });

  it("sorts data ascending when clicking sortable column header", async () => {
    const User = userEvent.setup();
    render(<DataTable {...defaultProps} />);

    const firstNameHeader = screen.getByText("First Name");
    await User.click(firstNameHeader);

    await waitFor(() => {
      const tableRows = screen.getAllByRole("row");
      const dataRows = tableRows.slice(1); 

      const firstRowCells = Array.from(dataRows[0].querySelectorAll("td"));
      const hasAlice = firstRowCells.some(
        (cell) => cell.textContent === "Alice",
      );
      expect(hasAlice).toBe(true);
    });
  });

  it("sorts data descending when clicking sortable column header twice", async () => {
    const User = userEvent.setup();
    render(<DataTable {...defaultProps} />);

    const firstNameHeader = screen.getByText("First Name");
    await User.click(firstNameHeader); 
    await User.click(firstNameHeader); 

    await waitFor(() => {
      const tableRows = screen.getAllByRole("row");
      const dataRows = tableRows.slice(1); 

      const firstRowCells = Array.from(dataRows[0].querySelectorAll("td"));
      const hasJohn = firstRowCells.some((cell) => cell.textContent === "John");
      expect(hasJohn).toBe(true);
    });
  });

  it("filters data when search term is entered", async () => {
    const User = userEvent.setup();
    render(<DataTable {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    await User.type(searchInput, "Engineering");

    await waitFor(
      () => {
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.queryByText("Jane")).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it("paginates data correctly", () => {
    render(<DataTable {...defaultProps} itemsPerPage={2} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    expect(screen.getByText("Next")).toBeInTheDocument();

    const paginationButtons = screen.getAllByRole("button");
    const hasPage2 = paginationButtons.some(
      (button) => button.textContent === "Next",
    );

    expect(hasPage2).toBe(true);
  });

it("changes items per page when dropdown changes", async () => {
  const User = userEvent.setup();
  render(<DataTable {...defaultProps} itemsPerPage={2} />);

  const pageSizeTrigger = screen.getByTestId('page-size-trigger');
  await User.click(pageSizeTrigger);
  
  const option25 = screen.getByTestId('page-size-option-25');
  await User.click(option25);

  await waitFor(() => {
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });
});

  it("applies custom cell render function", () => {
    const customColumns = [
      {
        title: "Full Name",
        dataKey: "fullName",
        render: (value, row) => (
          <strong>
            {row.firstName} {row.lastName}
          </strong>
        ),
      },
    ];

    const customData = [{ id: 1, firstName: "John", lastName: "Doe" }];

    render(<DataTable data={customData} columns={customColumns} />);

    const strongElement = screen.getByText("John Doe");
    expect(strongElement.tagName).toBe("STRONG");
  });

  // Test 1: Check by data-testid
  it("shows empty state when no data", () => {
    render(<DataTable data={[]} columns={mockColumns} />);

    const emptyElement = screen.getByTestId("data-table-empty");
    expect(emptyElement).toBeInTheDocument();
    expect(emptyElement).toHaveTextContent("No data available");
  });

  // Test 2: Check the actual rendered structure
  it("shows empty state when no data", () => {
    const { container } = render(<DataTable data={[]} columns={mockColumns} />);

    const tbody = container.querySelector("tbody");
    expect(tbody).toBeInTheDocument();

    const emptyRow = tbody.querySelector(".empty-row");
    expect(emptyRow).toBeInTheDocument();

    expect(emptyRow).toHaveTextContent("No data available");
  });

  it("shows custom empty message when no data", () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        emptyMessage="Custom empty message"
      />,
    );

    expect(screen.getByText("Custom empty message")).toBeInTheDocument();
  });

  it("supports zebra striping via prop", () => {
    const { container } = render(
      <DataTable {...defaultProps} striped={true} />,
    );

    expect(container.querySelector(".data-table")).toHaveClass("striped");
  });

  it("supports dark theme via prop", () => {
    const { container } = render(<DataTable {...defaultProps} theme="dark" />);

    expect(container.querySelector(".data-table")).toHaveClass("dark-theme");
  });

  it("handles row click callback", async () => {
    const MockRowClick = vi.fn();
    const User = userEvent.setup();
    render(<DataTable {...defaultProps} onRowClick={MockRowClick} />);

    const johnCell = screen.getByText("John");
    const row = johnCell.closest("tr");

    await User.click(row);

    expect(MockRowClick).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "John",
      }),
      expect.any(Object),
    );
  });

  it("shows loading state", () => {
    render(<DataTable {...defaultProps} loading={true} />);

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("disables pagination when prop is false", () => {
    render(<DataTable {...defaultProps} pagination={false} />);

    expect(screen.queryByText("Next")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("hides search when searchable is false", () => {
    render(<DataTable {...defaultProps} searchable={false} />);

    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });

  it("uses custom search placeholder", () => {
    render(
      <DataTable {...defaultProps} searchPlaceholder="Search employees..." />,
    );

    expect(
      screen.getByPlaceholderText("Search employees..."),
    ).toBeInTheDocument();
  });

  it('shows "Show X entries" format', () => {
    render(<DataTable {...defaultProps} />);

    expect(screen.getByText("Show")).toBeInTheDocument();
    expect(screen.getByText("entries")).toBeInTheDocument();
  });
});
