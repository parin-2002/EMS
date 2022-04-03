import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import instance from "../../../others/baseUrl";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { notifyError, notifySuccess } from "../../../notification/notify";
import { isAuthenticated } from "../../../redux/auth";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function Attendance() {
  const [loading, changeLoading] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [attendanceButton, setAttendanceButton] = useState(false);
  const designations = useSelector((state) => state.designation.value);
  const [emps, setEmps] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState();
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const departments = useSelector((state) => state.department.value);
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      designation: "",
      department: "",
      employeeId: "",
    },
    validationSchema: yup.object({
      designation: yup.string().required("Required"),
      department: yup.string().required("Required"),
      employeeId: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        if (selectedEmp?.leavingDate) {
          notifyError("Employee is leaved company");
        } else {
          setAttendance(true);
          setAttendanceButton(selectedEmp.statusCmpAttendance);
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  async function filterEmps(designation, department) {
    formik.setFieldValue("employeeId", "");
    if (designation && department) {
      const value = { designation, department };
      // console.log(value);
      try {
        changeLoading(true);
        const result = await instance.post(
          "/api/company/manageemp/findemp",
          value,
          {
            withCredentials: true,
          }
        );
        if (result) {
          changeLoading(false);
          setEmps(result.data.result);
        }
      } catch (err) {
        setEmps();
        changeLoading(false);
        notifyError(err.response.data.message);
        if (
          err.response.data.message == "invalid token" ||
          err.response.data.message == "Access Denied! Unauthorized User"
        ) {
          dispatch(isAuthenticated({ auth: false }));
        }
      }
    }
  }

  return (
    <>
      <div className="box">
        <div className="">
          <h5 className="h5-com">
            <AccessAlarmIcon className="mb-1" /> Attendance
          </h5>
        </div>

        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-3 card p-2">
              <p style={{ margin: "1.5px" }} className="mb-2">
                Filter Employees
              </p>
              <div className="d-flex">
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Designation
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="designation"
                      value={formik.values.designation}
                      label="designation"
                      onChange={(e) => {
                        formik.handleChange(e);
                        filterEmps(e.target.value, formik.values.department);
                        setSelectedEmp();
                        setAttendance(false);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.designation &&
                        Boolean(formik.errors.designation)
                      }
                    >
                      {designations?.map((value, index) => {
                        return (
                          <MenuItem key={index} value={value._id}>
                            {value.designation}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {formik.touched.designation && formik.errors.designation ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.designation}
                    </p>
                  ) : null}
                </div>
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Department
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="department"
                      value={formik.values.department}
                      label="department"
                      onChange={(e) => {
                        formik.handleChange(e);
                        filterEmps(formik.values.designation, e.target.value);
                        setSelectedEmp();
                        setAttendance(false);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.department &&
                        Boolean(formik.errors.department)
                      }
                    >
                      {departments?.map((value, index) => {
                        return (
                          <MenuItem key={index} value={value._id}>
                            {value.department}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {formik.touched.department && formik.errors.department ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.department}
                    </p>
                  ) : null}
                </div>
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Find Employee
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="employeeId"
                      value={formik.values.employeeId}
                      label="Find Employee"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.employeeId &&
                        Boolean(formik.errors.employeeId)
                      }
                    >
                      {emps?.map((value, index) => {
                        return (
                          <MenuItem
                            key={index}
                            onClick={() => {
                              setSelectedEmp(value);
                              setAttendance(false);
                              setAttendanceButton(false);
                            }}
                            value={value._id}
                          >
                            {value.fullname}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {formik.touched.employeeId && formik.errors.employeeId ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.employeeId}
                    </p>
                  ) : null}
                </div>
              </div>
              <p style={{ fontSize: "14px", margin: "0px", padding: "0px" }}>
                Note: Select Department and Designation both field for filtering
                employees
              </p>
              <div>
                {selectedEmp ? (
                  <div className="mt-3 p-2 row justify-content-end">
                    <div className="col-lg-2 col-md-2 col-sm-3 col">
                      <div style={{ width: "100px" }}>
                        <img
                          width="100%"
                          style={{
                            borderRadius: "50%",
                            border: "1px solid #1d366d",
                          }}
                          src={selectedEmp.profilepic}
                          alt="img"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-8 col-sm-8 col">
                      <p>
                        <span
                          style={{
                            color: "#1d366d",
                            fontWeight: "600",
                            marginRight: "5px",
                          }}
                        >
                          Name:
                        </span>
                        {selectedEmp.fullname}
                      </p>
                      <p>
                        <span
                          style={{
                            color: "#1d366d",
                            fontWeight: "600",
                            marginRight: "5px",
                          }}
                        >
                          Email:
                        </span>
                        {selectedEmp.email}
                      </p>
                      <p>
                        <span
                          style={{
                            color: "#1d366d",
                            fontWeight: "600",
                            marginRight: "5px",
                          }}
                        >
                          Mobileno:
                        </span>
                        {selectedEmp.mobileno}
                      </p>
                      <p>
                        <span
                          style={{
                            color: "#1d366d",
                            fontWeight: "600",
                            marginRight: "5px",
                          }}
                        >
                          JoiningDate:
                        </span>
                        {new Date(selectedEmp.joiningDate).toDateString()}
                      </p>
                      <p>
                        <span
                          style={{
                            color: "#1d366d",
                            fontWeight: "600",
                            marginRight: "5px",
                          }}
                        >
                          Gender:
                        </span>
                        {selectedEmp.gender}
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="text-center mt-2">
                {loading ? (
                  <CircularProgress style={{ color: "#1d366d" }} />
                ) : (
                  <Button variant="contained" type="submit">
                    Filter
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {attendance ? (
          <div className="mt-3">
            <div className="d-flex align-items-baseline">
              <p className="me-2">Start or End shift:</p>
              {attendanceLoading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button
                  variant="contained"
                  onClick={async () => {
                    try {
                      if (confirm("do you want to take attendance?")) {
                        setAttendanceLoading(true);
                        const result = await instance.post(
                          "/api/company/manageemp/takeattendance",
                          { employeeId: selectedEmp._id },
                          {
                            withCredentials: true,
                          }
                        );
                        if (result) {
                          setAttendanceLoading(false);
                          selectedEmp.statusCmpAttendance =
                            !selectedEmp.statusCmpAttendance;
                          setAttendanceButton(selectedEmp.statusCmpAttendance);
                          notifySuccess(result.data.result);
                        }
                      }
                    } catch (err) {
                      setAttendanceLoading(false);
                      notifyError(err.response.data.message);
                      if (
                        err.response.data.message == "invalid token" ||
                        err.response.data.message ==
                          "Access Denied! Unauthorized User"
                      ) {
                        dispatch(isAuthenticated({ auth: false }));
                      }
                    }
                  }}
                >
                  {attendanceButton ? "End shift" : "start shift"}
                </Button>
              )}
            </div>
            <div className="mt-3">
              <AttendanceTable employeeId={selectedEmp._id} />
            </div>
          </div>
        ) : (
          ""
        )}

        <div>
          <FilterEmpThroughAttendance />
        </div>
      </div>
    </>
  );
}

function AttendanceTable({ employeeId }) {
  const [loading, changeLoading] = useState(false);
  const [olddata, setOlddata] = useState({});
  const [data, setAttendanceData] = useState([]);
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstdate: "",
      seconddate: "",
      employeeId: employeeId,
    },
    validationSchema: yup.object({
      firstdate: yup.string().required("Required"),
      seconddate: yup.string().required("Required"),
      employeeId: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        if (
          values.firstdate != olddata?.firstdate ||
          values.seconddate != olddata?.seconddate
        ) {
          const result = await instance.post(
            "/api/company/manageemp/selectattendance",
            values,
            {
              withCredentials: true,
            }
          );
          if (result) {
            setAttendanceData(result.data.result);
            changeLoading(false);
            setOlddata(values);
          }
        }
        changeLoading(false);
        setOlddata(values);
      } catch (err) {
        setAttendanceData([]);
        notifyError(err.response.data.message);
        changeLoading(false);
        if (
          err.response.data.message == "invalid token" ||
          err.response.data.message == "Access Denied! Unauthorized User"
        ) {
          dispatch(isAuthenticated({ auth: false }));
        }
      }
    },
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = React.useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: "date",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.date).toDateString();
        },
      },
      {
        id: "shiftemp",
        Header: "Shift Taken By Employee",
        accessor: "shiftyTakenByEmployee",
        Cell: ({ cell }) => {
          return (
            <div>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      StartTime
                    </th>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      EndTime
                    </th>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      TotalTime(H:M)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cell.row.original.shiftyTakenByEmployee.map((one, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{ border: "1px solid gray", padding: "1px" }}
                        >
                          {new Date(one.startTime).toLocaleTimeString()}
                        </td>
                        <td
                          style={{ border: "1px solid gray", padding: "1px" }}
                        >
                          {one.endTime
                            ? new Date(one.endTime).toLocaleTimeString()
                            : "Not end yet"}
                        </td>
                        <td
                          style={{ border: "1px solid gray", padding: "1px" }}
                        >
                          {one.totalMilliseconds
                            ? `${Math.floor(
                                one.totalMinutes / 60
                              )}:${Math.floor(one.totalMinutes % 60)}`
                            : "Not end yet"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        },
      },
      {
        id: "shiftcmp",
        Header: "Shift Taken By Company",
        accessor: "shiftyTakenByCompany",
        Cell: ({ cell }) => {
          return (
            <div>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      StartTime
                    </th>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      EndTime
                    </th>
                    <th style={{ border: "1px solid gray", padding: "1px" }}>
                      TotalTime(H:M)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cell.row.original.shiftyTakenByCompany.map((one, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{ border: "1px solid gray", padding: "1px" }}
                        >
                          {new Date(one.startTime).toLocaleTimeString()}
                        </td>
                        <td
                          style={{ border: "1px solid gray", padding: "1px" }}
                        >
                          {one.endTime
                            ? new Date(one.endTime).toLocaleTimeString()
                            : "Not end yet"}
                        </td>
                        <td
                          style={{ border: "1px solid gray", padding: "1px" }}
                        >
                          {one.totalMilliseconds
                            ? `${Math.floor(
                                one.totalMinutes / 60
                              )}:${Math.floor(one.totalMinutes % 60)}`
                            : "Not end yet"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    state,
    setGlobalFilter,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);
  const { globalFilter } = state;

  return (
    <>
      <div className="mt-3">
        <form className="row" onSubmit={formik.handleSubmit}>
          <p>Filter Attendance Records</p>
          <div className="col">
            <TextField
              className="form-control"
              label="Select Date To"
              name="firstdate"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstdate}
              error={
                formik.touched.firstdate && Boolean(formik.errors.firstdate)
              }
            />
            {formik.touched.firstdate && formik.errors.firstdate ? (
              <p className="error">{formik.errors.firstdate}</p>
            ) : null}
          </div>
          <div className="col">
            <TextField
              className="form-control"
              label="Select Date From"
              name="seconddate"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.seconddate}
              error={
                formik.touched.seconddate && Boolean(formik.errors.seconddate)
              }
            />
            {formik.touched.seconddate && formik.errors.seconddate ? (
              <p className="error">{formik.errors.seconddate}</p>
            ) : null}
          </div>
          <div className="col-2  mt-2">
            {loading ? (
              <CircularProgress style={{ color: "#1d366d" }} />
            ) : (
              <Button variant="contained" type="submit">
                Filter
              </Button>
            )}
          </div>
        </form>

        {data.length ? (
          <Paper sx={{ width: "100%" }} className="mt-2">
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                {...getTableProps()}
                sx={{ width: "100%" }}
              >
                <TableHead className="sticky-top">
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      style={{ fontSize: "22px", color: "#1d366d" }}
                    >
                      <AccessAlarmIcon className="mb-1" /> Attendance Records
                    </TableCell>
                    <TableCell align="right" colSpan={2}>
                      <div>
                        <div>
                          <TextField
                            label="Search"
                            type="search"
                            variant="standard"
                            value={globalFilter || ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {headerGroups.map((headerGroup, index) => (
                    <TableRow key={index}>
                      {headerGroup.headers.map((column) => (
                        <TableCell
                          key={column?.id}
                          align={column?.align}
                          style={{ top: 57, width: column?.width }}
                          {...headerGroup.getHeaderGroupProps()}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ArrowDownwardIcon
                                  style={{
                                    marginLeft: "2px",
                                    fontSize: "18px",
                                  }}
                                />
                              ) : (
                                <ArrowUpwardIcon
                                  style={{
                                    marginLeft: "2px",
                                    fontSize: "18px",
                                  }}
                                />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      prepareRow(row);
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                          {...row.getRowProps()}
                        >
                          {row.cells.map((cell, index) => {
                            return (
                              <TableCell {...cell.getCellProps()} key={index}>
                                {cell.render("Cell")}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[2, 5, 10, 15, 20, 25, 30]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function FilterEmpThroughAttendance() {
  const [shiftBy, setShiftBy] = useState("statusEmpAttendance");
  const [status, setStatus] = useState(true);
  const [loading, changeLoading] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getRecords();
  }, [shiftBy, status]);

  async function getRecords() {
    try {
      changeLoading(true);
      const result = await instance.post(
        "/api/company/manageemp/filterempbyattendance",
        { shiftBy, status },
        {
          withCredentials: true,
        }
      );
      if (result) {
        changeLoading(false);
        setData(result.data.result);
      }
    } catch (err) {
      setData([]);
      changeLoading(false);
      notifyError(err.response.data.message);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = React.useMemo(
    () => [
      {
        id: "profilepic",
        Header: "Profile pic",
        Cell: ({ cell }) => {
          return (
            <div
              style={{
                width: "60px",
              }}
            >
              <img
                width="100%"
                style={{
                  borderRadius: "100%",
                }}
                src={cell.row.original.profilepic}
                alt="img"
              ></img>
            </div>
          );
        },
      },
      {
        id: "fullname",
        Header: "FullName",
        accessor: "fullname",
      },
      {
        id: "email",
        Header: "Email",
        accessor: "email",
      },
      {
        id: "mobileno",
        Header: "MobileNo",
        accessor: "mobileno",
      },
      {
        id: "designation",
        Header: "Designation",
        accessor: "designation",
        Cell: ({ cell }) => {
          return cell.row.original.designation.designation;
        },
      },
      {
        id: "department",
        Header: "Department",
        accessor: "department",
        Cell: ({ cell }) => {
          return cell.row.original.department.department;
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    state,
    setGlobalFilter,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);
  const { globalFilter } = state;

  return (
    <>
      <div className="mt-3">
        <h5 className="h5-com">Filter Employees by Attendance</h5>
        <div>
          <div className="row">
            <div className="mt-3 col">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Shift By</InputLabel>
                <Select
                  name="calculate"
                  value={shiftBy}
                  label="Shift By"
                  onChange={(e) => {
                    setShiftBy(e.target.value);
                  }}
                >
                  <MenuItem value="statusEmpAttendance">Employee</MenuItem>
                  <MenuItem value="statusCmpAttendance">Company</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="mt-3 col">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Shift Status
                </InputLabel>
                <Select
                  name="calculate"
                  value={status}
                  label="Shift Status"
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <MenuItem value={true}>ON</MenuItem>
                  <MenuItem value={false}>OFF</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div>
              <Paper sx={{ width: "100%" }} className="mt-2">
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    {...getTableProps()}
                    sx={{ width: "100%" }}
                  >
                    <TableHead className="sticky-top">
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          style={{ fontSize: "22px", color: "#1d366d" }}
                        >
                          <AccessAlarmIcon className="mb-1" /> Records
                        </TableCell>
                        <TableCell align="right" colSpan={3}>
                          <div>
                            <div>
                              <TextField
                                label="Search"
                                type="search"
                                variant="standard"
                                value={globalFilter || ""}
                                onChange={(e) =>
                                  setGlobalFilter(e.target.value)
                                }
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                      {headerGroups.map((headerGroup, index) => (
                        <TableRow key={index}>
                          {headerGroup.headers.map((column) => (
                            <TableCell
                              key={column?.id}
                              align={column?.align}
                              style={{ top: 57, width: column?.width }}
                              {...headerGroup.getHeaderGroupProps()}
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              {column.render("Header")}
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <ArrowDownwardIcon
                                      style={{
                                        marginLeft: "2px",
                                        fontSize: "18px",
                                      }}
                                    />
                                  ) : (
                                    <ArrowUpwardIcon
                                      style={{
                                        marginLeft: "2px",
                                        fontSize: "18px",
                                      }}
                                    />
                                  )
                                ) : (
                                  ""
                                )}
                              </span>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          prepareRow(row);
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                              {...row.getRowProps()}
                            >
                              {row.cells.map((cell, index) => {
                                return (
                                  <TableCell
                                    {...cell.getCellProps()}
                                    key={index}
                                  >
                                    {cell.render("Cell")}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[2, 5, 10, 15, 20, 25, 30]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <div className="text-center">
                  {loading ? (
                    <CircularProgress style={{ color: "#1d366d" }} />
                  ) : (
                    ""
                  )}
                </div>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Attendance;
