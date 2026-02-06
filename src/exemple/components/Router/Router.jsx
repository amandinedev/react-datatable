import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeList from "../../pages/EmployeeListPage/EmployeeListPage.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/employee-list" element={<EmployeeList />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
