import React from "react";
import reactDom from "react-dom";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { companyAuthReducer, employeeAuthReducer } from "./redux/auth";
import {
  empProfileReducer,
  companyProfileReducer,
  managerDetailReducer,
  empAttendanceReducer,
} from "./redux/empdata";
import {
  companyDesignationReducer,
  companyDepartmentReducer,
  companyProfileDataReducer,
} from "./redux/companydata";

const store = configureStore({
  reducer: {
    companyauth: companyAuthReducer,
    empauth: employeeAuthReducer,
    designation: companyDesignationReducer,
    department: companyDepartmentReducer,
    empprofile: empProfileReducer,
    companyprofile: companyProfileReducer,
    managerdetail: managerDetailReducer,
    companyprofiledata: companyProfileDataReducer,
    empattendance: empAttendanceReducer,
  },
});

reactDom.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.querySelector("#root")
);
