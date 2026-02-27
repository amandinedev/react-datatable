import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 
import DataTable from "../../../components/DataTable/DataTable.jsx";
import "./EmployeeListPage.scss";

const EmployeeListPage = () => {
  const employees = useSelector((state) => state.employees.list); 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const employeeColumns = [
    {
      dataKey: "firstName",
      title: "First Name",
      sortable: true,
      searchable: true,
      width: "120px",
    },
    {
      dataKey: "lastName",
      title: "Last Name",
      sortable: true,
      searchable: true,
      width: "120px",
    },
    {
      dataKey: "startDate",
      title: "Start Date",
      sortable: true,
      width: "120px",
      render: (value) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      dataKey: "department",
      title: "Department",
      sortable: true,
      searchable: true,
      width: "150px",
    },
    {
      dataKey: "dateOfBirth",
      title: "Date of Birth",
      sortable: true,
      width: "120px",
      render: (value) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      dataKey: "street",
      title: "Street",
      sortable: true,
      width: "200px",
    },
    {
      dataKey: "city",
      title: "City",
      sortable: true,
      searchable: true,
      width: "120px",
    },
    {
      dataKey: "state",
      title: "State",
      sortable: true,
      width: "80px",
    },
    {
      dataKey: "zipCode",
      title: "Zip Code",
      sortable: true,
      width: "100px",
    },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

   const handleRowClick = (row) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(row.id)
        ? prevSelected.filter(id => id !== row.id)
        : [...prevSelected, row.id]
    );
  };

  return (
    <main className="employee-list-container">
      <header className="page-header">
        <h1>Current Employees</h1>
        <p className="page-subtitle">
          View and manage all employees in the system
        </p>
      </header>

      <div className="table-container">
        <DataTable
          // Data
          data={employees}
          columns={employeeColumns}
          selectedRows={selectedRows}
          onRowClick={handleRowClick}
          // Configuration
          itemsPerPage={10}
          searchable={true}
          sortable={true}
          pagination={true}
          striped={true}
          compact={false}
          theme="light"
          searchMode="and"
          // Customization
          className="employee-data-table"
          searchPlaceholder="employees by name...(space between keywords)"
          emptyMessage={
            employees.length === 0
              ? "No employees added yet"
              : "No matching employees found"
          }
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default EmployeeListPage;
