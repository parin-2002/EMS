import React, { useEffect } from "react";
//home page
import { Home } from "./Home/HomeComponets";
//end of home page
//company componets
import Login from "./company/Login";
import Register from "./company/Register";
//company navbar componets
import CNav from "./company/Nav";
import CHome from "./company/componets/Home";
import Profile from "./company/componets/Profile";
import Schedule from "./company/componets/Schedule";
import ViewEditemp, {
  EmpNav,
} from "./company/componets/manage_emp/ViewEditemp";
import Addemp from "./company/componets/manage_emp/Addemp";
import ManageDesignation from "./company/componets/manage_emp/ManageDesignation";
import ManageDepartment from "./company/componets/manage_emp/ManageDepartment";
import Salary from "./company/componets/manage_emp/Salary";
import Attendance from "./company/componets/manage_emp/Attendance";
import Leave from "./company/componets/manage_emp/Leave";
//end of company compomets
//emp
import EmpLogin from "./employee/Login";
import Enav from "./employee/Nav";
import Eattendance from "./employee/componets/Attendance";
import EcompanyProfile from "./employee/componets/CompanyProfile";
import Dashboard from "./employee/componets/Dashboard";
import Eleave from "./employee/componets/Leave";
import MyProfile from "./employee/componets/MyProfile";
import Esalary from "./employee/componets/Salary";
import Eschedule from "./employee/componets/Schedule";
//emd emp
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import instance from "./others/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { isAuthenticated, isEmpAuthenticated } from "./redux/auth";
import {
  storeDesignation,
  storeDepartment,
  storeCompanyProfileData,
} from "./redux/companydata";
import {
  storeCompanyProfile,
  storeEmpProfile,
  storeManagerDetail,
  takeAttendance,
} from "./redux/empdata";
import { notifyError } from "./notification/notify";
import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
//notification toast notify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const companyauth = useSelector((state) => state.companyauth.value);
  const empauth = useSelector((state) => state.empauth.value);
  const managerdetail = useSelector((state) => state.managerdetail.value);
  const dispatch = useDispatch();

  // console.log(companyauth);
  // console.log(empauth);
  async function checkToken() {
    try {
      const result = await instance.get("/checktoken", {
        withCredentials: true,
      });
      if (result) {
        if (result.data.accounttype == "employee") {
          dispatch(isEmpAuthenticated({ auth: true }));
        } else {
          dispatch(isAuthenticated({ auth: true }));
        }
      }
    } catch (err) {
      // console.log(err.response.data);
      dispatch(isEmpAuthenticated({ auth: false }));
      dispatch(isAuthenticated({ auth: false }));
    }
  }
  async function getDesignation() {
    try {
      const result = await instance.get(
        "/api/company/manageemp/selectdesignation",
        {
          withCredentials: true,
        }
      );
      if (result) {
        dispatch(storeDesignation(result.data.result));
      }
    } catch (err) {
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }
  async function getDepartment() {
    try {
      const result = await instance.get(
        "/api/company/manageemp/selectdepartment",
        {
          withCredentials: true,
        }
      );
      if (result) {
        dispatch(storeDepartment(result.data.result));
      }
    } catch (err) {
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }
  async function getEmp() {
    try {
      const result = await instance.get("/api/emp/selectemp", {
        withCredentials: true,
      });
      if (result) {
        dispatch(storeEmpProfile(result.data.result));
        dispatch(
          takeAttendance({
            attendance: result.data.result.statusEmpAttendance,
          })
        );
        if (result.data.result.managerId) {
          if (!managerdetail.fullname) {
            const res = await instance.get(
              `/api/emp/selectmanager?id=${result.data.result.managerId}`,
              {
                withCredentials: true,
              }
            );
            if (res) {
              dispatch(storeManagerDetail(res.data.result));
            }
          }
        }
      }
    } catch (err) {
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isEmpAuthenticated({ auth: false }));
      }
    }
  }
  async function getCompany() {
    try {
      const result = await instance.get("/api/emp/selectcompany", {
        withCredentials: true,
      });
      if (result) {
        dispatch(storeCompanyProfile(result.data.result));
      }
    } catch (err) {
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isEmpAuthenticated({ auth: false }));
      }
    }
  }
  async function getCompanyProfile() {
    try {
      const result = await instance.get("/api/company/selectcompanydetail", {
        withCredentials: true,
      });
      if (result) {
        dispatch(storeCompanyProfileData(result.data.result));
      }
    } catch (err) {
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }
  useEffect(() => {
    checkToken();
  }, [1]);

  function ProtectedCompanyRoute() {
    return companyauth.auth ? (
      <CNav
        getDepartment={getDepartment}
        getDesignation={getDesignation}
        getCompanyProfile={getCompanyProfile}
      />
    ) : (
      <Navigate to="/companylogin" />
    );
  }

  function ProtectedEmpRoute() {
    return empauth.auth ? (
      <Enav getEmp={getEmp} getCompany={getCompany} />
    ) : (
      <Navigate to="/emplogin" />
    );
  }

  function CheckLogin() {
    return companyauth.auth ? <Navigate to="/company" /> : <Login />;
  }

  function CheckEmpLogin() {
    return empauth.auth ? <Navigate to="/emp" /> : <EmpLogin />;
  }

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="companylogin" element={<CheckLogin />} />
          <Route path="companyregister" element={<Register />} />

          {/* protected routes of company */}
          <Route path="/company" element={<ProtectedCompanyRoute />}>
            <Route index element={<CHome />} />
            <Route
              path="profile"
              element={<Profile getCompanyProfile={getCompanyProfile} />}
            />
            <Route path="schedule" element={<Schedule />} />

            <Route path="emp" element={<EmpNav />}>
              <Route
                index
                element={
                  <ViewEditemp
                    getDepartment={getDepartment}
                    getDesignation={getDesignation}
                  />
                }
              />
              <Route
                path="add"
                element={
                  <Addemp
                    getDepartment={getDepartment}
                    getDesignation={getDesignation}
                  />
                }
              />
              <Route
                path="managedesignation"
                element={<ManageDesignation getDesignation={getDesignation} />}
              />
              <Route
                path="ManageDepartment"
                element={<ManageDepartment getDepartment={getDepartment} />}
              />
            </Route>
            <Route path="Salary" element={<Salary />} />
            <Route path="Attendance" element={<Attendance />} />
            <Route path="leave" element={<Leave />} />
          </Route>
          {/* all above routes are protected */}
          <Route path="/emplogin" element={<CheckEmpLogin />} />
          {/* emp routes */}
          <Route path="/emp" element={<ProtectedEmpRoute />}>
            <Route index element={<EcompanyProfile />} />
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="CompanyDetail" element={<EcompanyProfile />} />
            <Route path="MyProfile" element={<MyProfile getEmp={getEmp} />} />
            <Route path="schedule" element={<Eschedule />} />
            <Route path="attendance" element={<Eattendance />} />
            <Route path="Leave" element={<Eleave />} />
            <Route path="Salary" element={<Esalary />} />
          </Route>
          {/* all above routes are protected */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
