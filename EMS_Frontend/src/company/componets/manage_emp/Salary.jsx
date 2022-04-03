import React, { useState } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
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
import { useEffect } from "react";

function Salary() {
  const [selectedEmp, setSelectedEmp] = useState();
  const designations = useSelector((state) => state.designation.value);
  const departments = useSelector((state) => state.department.value);
  const [emps, setEmps] = useState([]);
  const [loading, changeLoading] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setSelectedEmp(selectedEmp);
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      designation: "",
      department: "",
      employeeId: "",
      firstdate: "",
      seconddate: "",
      calculate: "",
    },
    validationSchema: yup.object({
      designation: yup.string().required("Required"),
      department: yup.string().required("Required"),
      employeeId: yup.string().required("Required"),
      firstdate: yup.string().required("Required"),
      seconddate: yup.string().required("Required"),
      calculate: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.post(
          "/api/company/manageemp/calculatetime",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          changeLoading(false);
          setData(result.data.result);
          setTotalMinutes(result.data.totalMinutes);
        }
      } catch (err) {
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
        id: "startTime",
        Header: "Start Time",
        accessor: "startTime",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.startTime).toLocaleString();
        },
        width: "30%",
      },
      {
        id: "endTime",
        Header: "End Time",
        accessor: "endTime",
        Cell: ({ cell }) => {
          return cell.row.original.endTime
            ? new Date(cell.row.original.endTime).toLocaleString()
            : "Not end yet";
        },
        width: "30%",
      },
      {
        id: "Total Time(HH:MM)",
        Header: "Total Time(HH:MM)",
        accessor: "Total Time(HH:MM)",
        Cell: ({ cell }) => {
          var hours = Math.floor(cell.row.original.totalMinutes / 60);
          var minutes = cell.row.original.totalMinutes % 60;
          return cell.row.original.totalMinutes != undefined
            ? `${hours}:${minutes}`
            : "-";
        },
        width: "30%",
      },
      // {
      //   id: "Salary",
      //   Header: "Salary",
      //   accessor: "Salary",
      //   Cell: ({ cell }) => {
      //     // let rate = selectedEmp?.hourlysalary / 60;
      //     // return cell.row.original.totalMinutes != undefined
      //     //   ? `${(cell.row.original.totalMinutes * rate).toFixed(2)}${
      //     //       selectedEmp?.currency
      //     //     }`
      //     //   : "-";
      //     return cell.row.original.totalMinutes;
      //   },
      //   width: "30%",
      // },
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
        setEmps([]);
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
        <div className="h5-com text-center">
          <h3>
            <AccountBalanceIcon
              className="me-2 mb-1"
              style={{ fontSize: "26px" }}
            />
            Manage Salary Details
          </h3>
        </div>

        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-3 card p-2">
              <p style={{ margin: "1.5px" }} className="mb-2">
                Fill Details
              </p>
              <div className="row">
                <div className="w-100 me-1 mt-3">
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
                        setData([]);
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
                <div className="w-100 me-1 mt-3">
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
                        setData([]);
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
                <div className="col mt-3">
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
                      formik.touched.firstdate &&
                      Boolean(formik.errors.firstdate)
                    }
                  />
                  {formik.touched.firstdate && formik.errors.firstdate ? (
                    <p className="error">{formik.errors.firstdate}</p>
                  ) : null}
                </div>
                <div className="col mt-3">
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
                      formik.touched.seconddate &&
                      Boolean(formik.errors.seconddate)
                    }
                  />
                  {formik.touched.seconddate && formik.errors.seconddate ? (
                    <p className="error">{formik.errors.seconddate}</p>
                  ) : null}
                </div>
                <div className="mt-3">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Shift Taken By
                    </InputLabel>
                    <Select
                      name="calculate"
                      value={formik.values.calculate}
                      label="Shift Taken By"
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="shiftyTakenByEmployee">
                        Employee
                      </MenuItem>
                      <MenuItem value="shiftyTakenByCompany">Company</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="w-100 me-1 mt-3">
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

        {data.length ? (
          <div>
            <div className="card mt-3">
              <div className="d-flex p-2 justify-content-between mx-5 mt-2">
                <div className="">
                  <h6 className="h5-com">Total time this month(HH:MM)</h6>
                  <p>
                    {Math.floor(totalMinutes / 60)}:{totalMinutes % 60}
                  </p>
                </div>
                <div className="ms-5">
                  <h6 className="h5-com">Pay Rate</h6>
                  <p>
                    {selectedEmp.hourlysalary}
                    {selectedEmp.currency}
                  </p>
                </div>
                <div className="ms-5">
                  <h6 className="h5-com">Total Salary</h6>
                  <p>
                    {((selectedEmp.hourlysalary / 60) * totalMinutes).toFixed(
                      2
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Paper sx={{ width: "100%" }}>
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
                          <AccountBalanceIcon className="mb-1" /> Salary Records
                        </TableCell>
                        <TableCell colSpan={2}>
                          {/* <TextField
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
                      /> */}
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
                  rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default Salary;
