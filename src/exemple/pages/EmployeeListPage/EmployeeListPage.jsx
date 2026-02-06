// EmployeeListPage.jsx
import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux"; //uncomment to use redux employees
import DataTable from "../../../components/DataTable/DataTable.jsx";
import "./EmployeeListPage.scss";

const EmployeeListPage = () => {
  // const employees = useSelector((state) => state.employees.list); //uncomment to use redux employees
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const employees = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      startDate: "2020-01-15",
      department: "Sales",
      dateOfBirth: "1985-03-22",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      startDate: "2019-06-10",
      department: "Marketing",
      dateOfBirth: "1990-07-15",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
    },
    {
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      startDate: "2021-03-05",
      department: "Engineering",
      dateOfBirth: "1988-11-30",
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
    },
    {
      id: 4,
      firstName: "Alice",
      lastName: "Williams",
      startDate: "2022-08-20",
      department: "HR",
      dateOfBirth: "1992-05-14",
      street: "321 Elm St",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
    },
    {
      id: 5,
      firstName: "Charlie",
      lastName: "Brown",
      startDate: "2018-11-30",
      department: "Finance",
      dateOfBirth: "1983-09-08",
      street: "654 Maple Dr",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
    },
    {
      id: 6,
      firstName: "Diana",
      lastName: "Miller",
      startDate: "2023-01-10",
      department: "IT",
      dateOfBirth: "1995-02-18",
      street: "987 Cedar Ln",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19019",
    },
    {
      id: 7,
      firstName: "Edward",
      lastName: "Davis",
      startDate: "2020-07-22",
      department: "Operations",
      dateOfBirth: "1987-12-03",
      street: "147 Birch St",
      city: "San Antonio",
      state: "TX",
      zipCode: "78201",
    },
    {
      id: 8,
      firstName: "Fiona",
      lastName: "Garcia",
      startDate: "2021-09-15",
      department: "Customer Service",
      dateOfBirth: "1993-04-25",
      street: "258 Willow Way",
      city: "San Diego",
      state: "CA",
      zipCode: "92101",
    },
    {
      id: 9,
      firstName: "George",
      lastName: "Rodriguez",
      startDate: "2019-04-05",
      department: "Sales",
      dateOfBirth: "1986-08-12",
      street: "369 Spruce Ave",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
    },
    {
      id: 10,
      firstName: "Helen",
      lastName: "Martinez",
      startDate: "2022-02-28",
      department: "Marketing",
      dateOfBirth: "1991-06-30",
      street: "741 Oak St",
      city: "San Jose",
      state: "CA",
      zipCode: "95101",
    },
  ];//comment to use redux employees

  // Define columns for the table - WITHOUT ID COLUMN
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
          theme="dark"
          // Customization
          className="employee-data-table"
          searchPlaceholder="employees by name..."
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
