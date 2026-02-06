import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
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
