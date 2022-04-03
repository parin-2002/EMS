import React, { useEffect, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { isAuthenticated } from "../../redux/auth";
import { notifyError } from "../../notification/notify";
import instance from "../../others/baseUrl";

function CHome() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const dispatch = useDispatch();

  function navigateToEmpList() {
    navigate("/company/emp");
  }

  async function getData() {
    try {
      const result = await instance.get("/api/company/manageemp/getStatistic", {
        withCredentials: true,
      });
      if (result) {
        setData(result.data.result);
      }
    } catch (err) {
      setData();
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
    getData();
  }, [1]);

  return (
    <>
      <div className="box">
        <div className="h5-com text-center">
          <h3>
            <DashboardIcon className="me-2 mb-1" style={{ fontSize: "26px" }} />
            Dashboard
          </h3>
          <hr />
        </div>

        <div className="">
          <h5 className="h5-com ms-5 my-2">Employee Details</h5>
          <div className="row mx-2 justify-content-center">
            <div className="card p-2 m-1 col-5">
              Current Employees<span>{data?.currentemp || 0}</span>
              <a className="text-end" onClick={navigateToEmpList}>
                view more
              </a>
            </div>
            <div className="card p-2 m-1 col-5">
              Leaved Employees<span>{data?.leavedemp || 0}</span>
              <a className="text-end" onClick={navigateToEmpList}>
                view more
              </a>
            </div>
            <div className="card p-2 m-1 col-5">
              Employees on leave today<span>{data?.emponleave || 0}</span>
              <a
                className="text-end"
                onClick={() => navigate("/company/leave")}
              >
                view more
              </a>
            </div>
            <div className="card p-2 m-1 col-5">
              Employees started shift<span>{data?.empstartedshift || 0}</span>
              <a
                className="text-end"
                onClick={() => navigate("/company/attendance")}
              >
                view more
              </a>
            </div>
          </div>
        </div>

        <div className="">
          <h5 className="h5-com ms-5 my-2">Manage Employees</h5>
          <div className="row mx-2 justify-content-center">
            <div className="card p-2 m-1 col-3 text-center">
              <h6
                className="h5-com edit"
                onClick={() => navigate("/company/profile")}
              >
                View Profile
              </h6>
            </div>
            <div className="card p-2 m-1 col-3 text-center">
              <h6
                className="h5-com edit"
                onClick={() => navigate("/company/schedule")}
              >
                Scheduler
              </h6>
            </div>
            <div className="card p-2 m-1 col-3 text-center">
              <h6
                className="h5-com edit"
                onClick={() => navigate("/company/emp")}
              >
                view & edit employees
              </h6>
            </div>
            <div className="card p-2 m-1 col-3 text-center">
              <h6
                className="h5-com edit"
                onClick={() => navigate("/company/attendance")}
              >
                Attendance
              </h6>
            </div>
            <div className="card p-2 m-1 col-3 text-center">
              <h6
                className="h5-com edit"
                onClick={() => navigate("/company/leave")}
              >
                Leave
              </h6>
            </div>
            <div className="card p-2 m-1 col-3 text-center">
              <h6
                className="h5-com edit"
                onClick={() => navigate("/company/salary")}
              >
                Salary
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CHome;
