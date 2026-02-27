import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [{
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
      department: "Human resources",
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
      department: "Sales",
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
      department: "Marketing",
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
      department: "Engineering",
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
      department: "Human resources",
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
    },],//initial list for preview
  status: 'idle', 
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployeeStart: (state) => {
      state.status = 'loading';
    },
    addEmployeeSuccess: (state, action) => {
      state.status = 'succeeded';
      state.list.push(action.payload);
    },
    addEmployeeFailed: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { addEmployeeStart, addEmployeeSuccess, addEmployeeFailed } = employeeSlice.actions;

export default employeeSlice.reducer;

// Selectors
export const selectAllEmployees = (state) => state.employees.list;
