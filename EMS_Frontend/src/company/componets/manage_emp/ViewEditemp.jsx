import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, Outlet } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
// import Divider from "@mui/material/Divider";
import PageviewIcon from "@mui/icons-material/Pageview";
import AddBoxIcon from "@mui/icons-material/AddBox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DomainIcon from "@mui/icons-material/Domain";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReadMoreIcon from "@mui/icons-material/ReadMore";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  notifyError,
  notifySuccess,
  notifyInfo,
} from "../../../notification/notify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useSelector, useDispatch } from "react-redux";
import currency_list from "../../../others/currencyData";
import CircularProgress from "@mui/material/CircularProgress";
import instance from "../../../others/baseUrl";
import { isAuthenticated } from "../../../redux/auth";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function EmpNav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <h3 className="bolder h5-com">
          <ManageAccountsIcon
            style={{
              fontSize: "35px",
              marginBottom: "6px",
              marginRight: "8px",
            }}
          />
          Mange employee
        </h3>
        <Button
          id="demo-customized-button"
          aria-controls="demo-customized-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Options
        </Button>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} disableRipple>
            <Link to="/company/emp" className="text-dark rm-td">
              <PageviewIcon style={{ fontSize: "22px", marginBottom: "2px" }} />
              View & Edit
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            <Link to="add" className="text-dark rm-td">
              <AddBoxIcon style={{ fontSize: "22px", marginBottom: "2px" }} />
              New employee
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            <Link to="ManageDepartment" className="text-dark rm-td">
              <DomainIcon style={{ fontSize: "22px", marginBottom: "2px" }} />
              Manage Departments
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            <Link to="managedesignation" className="text-dark rm-td">
              <AccountBoxIcon
                style={{ fontSize: "22px", marginBottom: "2px" }}
              />
              Manage Designations
            </Link>
          </MenuItem>
          {/* <Divider sx={{ my: 0.5 }} /> */}
        </StyledMenu>
      </div>
      <hr />
      <div className="container-fluid w-100">
        <Outlet />
      </div>
    </>
  );
}

function ViewEditemp({ getDepartment, getDesignation }) {
  const [data, setData] = useState([]);
  const [loading, changeLoading] = useState(false);
  const dispatch = useDispatch();

  async function getEmps() {
    try {
      changeLoading(true);
      const result = await instance.get("/api/company/manageemp/selectemp", {
        withCredentials: true,
      });
      if (result) {
        changeLoading(false);
        setData(result.data.result);
      }
    } catch (err) {
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

  useEffect(() => {
    getEmps();
    // getDepartment();
    // getDesignation();
  }, [1]);

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
        id: "address",
        Header: "Address",
        accessor: "address",
      },
      {
        id: "gender",
        Header: "Gender",
        accessor: "gender",
      },
      {
        id: "joiningDate",
        Header: "JoiningDate",
        accessor: "joiningDate",
        Cell: ({ cell }) => {
          return new Date(cell.row.original.joiningDate).toDateString();
        },
      },
      {
        id: "leavingDate",
        Header: "leavingDate",
        accessor: "leavingDate",
        Cell: ({ cell }) => {
          return cell.row.original.leavingDate
            ? new Date(cell.row.original.leavingDate).toDateString()
            : "---------";
        },
      },
      {
        id: "more",
        Header: "More",
        Cell: ({ cell }) => {
          return <EditEmp data={cell.row.original} getEmps={getEmps} />;
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
                <PeopleAltIcon className="mb-1" /> Employees
              </TableCell>
              <TableCell align="right" colSpan={2}>
                <ReplaceManager getEmps={getEmps} />
              </TableCell>
              <TableCell align="right" colSpan={4}>
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
              </TableCell>
              <TableCell colSpan={1}>
                <Link to="add">
                  <AddBoxIcon style={{ fontSize: "30px" }} />
                </Link>
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
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ArrowDownwardIcon
                            style={{ marginLeft: "2px", fontSize: "18px" }}
                          />
                        ) : (
                          <ArrowUpwardIcon
                            style={{ marginLeft: "2px", fontSize: "18px" }}
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
        rowsPerPageOptions={[3, 5, 10, 15, 20, 25, 30]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {loading ? (
        <div className="my-2 text-center">
          <CircularProgress style={{ color: "#1d366d" }} />
        </div>
      ) : (
        ""
      )}
    </Paper>
  );
}

function EditEmp({ data, getEmps }) {
  const dispatch = useDispatch();
  data.workexperience = data.workexperience ? data.workexperience : 0;
  data.joiningDate = formatDate(data.joiningDate);
  data.leavingDate = data.leavingDate ? formatDate(data.leavingDate) : "";
  data.managerId = data.managerId ? data.managerId : "";
  data.managerDesignation = data.managerDesignation
    ? data.managerDesignation
    : "";
  data.managerDepartment = data.managerDepartment ? data.managerDepartment : "";
  const [loading, changeLoading] = useState(false);
  const designations = useSelector((state) => state.designation.value);
  const [findManager, setFindManager] = useState([]);
  const departments = useSelector((state) => state.department.value);
  const [mobileno, setMobileno] = useState(data.mobileno);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: data._id,
      fullname: data.fullname,
      email: data.email,
      mobileno: data.mobileno,
      address: data.address,
      designation: data.designation,
      department: data.department,
      managerId: data.managerId,
      workexperience: data.workexperience,
      workexp_where: data.workexp_where,
      study_info: data.study_info,
      remark: data.remark,
      otherDetail: data.otherDetail,
      joiningDate: data.joiningDate,
      managerDesignation: data.managerDesignation,
      managerDepartment: data.managerDepartment,
      hoursperday: data.hoursperday,
      workdaysinweek: data.workdaysinweek,
      hourlysalary: data.hoursperday,
      currency: data.currency,
      leavingDate: data.leavingDate,
      gender: data.gender,
    },
    validationSchema: yup.object({
      fullname: yup
        .string()
        .min(5, "minimum 5 character required")
        .max(50, "maximum 50 charcter allowed")
        .test(
          "fullname is invalid",
          "Special charecters are not allowed",
          (value) => {
            return /^[a-z A-Z]*$/.test(value);
          }
        )
        .required("Required"),
      email: yup
        .string()
        .test("invalid email", (value) => {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        })
        .required("Required"),
      mobileno: yup
        .string()
        .test("invalid mobileno", (value) => {
          return isValidPhoneNumber(value || "");
        })
        .required("Required"),
      address: yup
        .string()
        .min(30, "minimum 30 character")
        .required("Required"),
      gender: yup.string().required("Required"),
      designation: yup.string().required("Required"),
      department: yup.string().required("Required"),
      managerId: yup.string(),
      workexperience: yup
        .number()
        .min(0, "valid number required")
        .max(1900, "valid number required"),
      workexp_where: yup.string(),
      study_info: yup.string().required("Required"),
      salaryDetail: yup.object(),
      remark: yup.string(),
      otherDetail: yup.string(),
      joiningDate: yup.date().required("Required"),
      managerDesignation: yup.string(),
      hoursperday: yup
        .number()
        .positive("must be positive")
        .min(0, "must be positive")
        .max(24, "can't be 24 above"),
      workdaysinweek: yup
        .number()
        .positive("must be positive")
        .min(0, "must be positive")
        .max(7, "can't be 7 above"),
      hourlysalary: yup
        .number()
        .positive("must be positive")
        .min(0, "must be positive"),
      currency: yup.string().test("Required", "Required", (value) => {
        if (formik.values.hourlysalary == 0) {
          return true;
        } else if (value && formik.values.hourlysalary != 0) {
          return true;
        } else {
          return false;
        }
      }),
      leavingDate: yup
        .date()
        .test("invalid date", "you can not add past date", (value) => {
          return new Date(value).getTime() <
            new Date(new Date().toDateString()).getTime()
            ? false
            : true;
        }),
    }),
    onSubmit: async (values) => {
      if (
        values.fullname != data.fullname ||
        values.email != data.email ||
        values.mobileno != data.mobileno ||
        values.address != data.address ||
        values.designation != data.designation ||
        values.department != data.department ||
        values.managerId != data.managerId ||
        values.workexperience != data.workexperience ||
        values.workexp_where != data.workexp_where ||
        values.study_info != data.study_info ||
        values.remark != data.remark ||
        values.otherDetail != data.otherDetail ||
        values.joiningDate != data.joiningDate ||
        values.managerDesignation != data.managerDesignation ||
        values.managerDepartment != data.managerDepartment ||
        values.hoursperday != data.hoursperday ||
        values.workdaysinweek != data.workdaysinweek ||
        values.hourlysalary != data.hoursperday ||
        values.currency != data.currency ||
        values.leavingDate != data.leavingDate ||
        values.gender != data.gender
      ) {
        try {
          changeLoading(true);
          const result = await instance.put(
            "/api/company/manageemp/updateemp",
            values,
            {
              withCredentials: true,
            }
          );
          if (result) {
            notifySuccess(result.data.result);
            changeLoading(false);
            getEmps();
          }
        } catch (err) {
          if (
            err.response.data.message == "invalid token" ||
            err.response.data.message == "Access Denied! Unauthorized User"
          ) {
            dispatch(isAuthenticated({ auth: false }));
          }
          changeLoading(false);
          const message = err.response.data.message;
          if (message.includes("duplicate") && message.includes("email")) {
            formik.setFieldValue("email", data.email);
            notifyError("email alarady exists");
          } else if (
            message.includes("duplicate") &&
            message.includes("mobileno")
          ) {
            setMobileno(data.mobileno);
            formik.setFieldValue("mobileno", data.mobileno);
            notifyError("mobileno alarady exists");
          } else if (message.includes("need to replace manager")) {
            notifyError(message);
            formik.setFieldValue("leavingDate", "");
          } else {
            notifyError(message);
          }
        }
      } else {
        notifyInfo("no update found");
      }
    },
  });

  async function filterManager(designation, department) {
    //  console.log(designationid, departmentid);
    if (designation && department) {
      const value = { designation, department };
      // console.log(value);
      try {
        const result = await instance.post(
          "/api/company/manageemp/findemp",
          value,
          {
            withCredentials: true,
          }
        );
        if (result) {
          setFindManager(result.data.result);
        }
      } catch (err) {
        setFindManager();
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
    <div>
      <ReadMoreIcon
        className="edit"
        onClick={() => {
          handleClickOpen();
          if (data.managerDesignation || data.managerDepartment) {
            filterManager(data.managerDesignation, data.managerDepartment);
          }
        }}
        style={{ fontSize: "30px" }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="text-center h5-com">
          <AppRegistrationIcon className="mb-1" /> View And Edit Employee
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-3">
              <TextField
                className="form-control"
                label="Employee Full Name"
                name="fullname"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullname}
                error={
                  formik.touched.fullname && Boolean(formik.errors.fullname)
                }
                required
              />
              {formik.touched.fullname && formik.errors.fullname ? (
                <p className="error">{formik.errors.fullname}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label=" Email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                required
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="error">{formik.errors.email}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <PhoneInput
                style={{ display: "flex" }}
                className="form-control"
                label="Company MobileNo"
                name="mobileno"
                type="text"
                value={mobileno}
                onBlur={formik.handleBlur}
                onChange={(val) => {
                  formik.setFieldValue("mobileno", val);
                  setMobileno(val);
                }}
                required
              />
              {formik.touched.mobileno && formik.errors.mobileno ? (
                <p className="error">{formik.errors.mobileno}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="Address"
                name="address"
                type="text"
                multiline
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                error={formik.touched.address && Boolean(formik.errors.address)}
                required
              />
              {formik.touched.address && formik.errors.address ? (
                <p className="error">{formik.errors.address}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              {formik.touched.gender && formik.errors.gender ? (
                <p className="error" style={{ margin: "0px" }}>
                  {formik.errors.gender}
                </p>
              ) : null}
            </div>

            <div className="mt-3 d-flex">
              <div className="w-100 me-1">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Designation
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="designation"
                    value={formik.values.designation}
                    label="Designation"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.designation &&
                      Boolean(formik.errors.designation)
                    }
                    required
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
            </div>

            <div className="mt-3 d-flex">
              <div className="w-100 me-1">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="department"
                    value={formik.values.department}
                    label="Department"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.department &&
                      Boolean(formik.errors.department)
                    }
                    required
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
            </div>

            <div className="mt-3 card p-2">
              <p style={{ margin: "1.5px" }} className="mb-2">
                Select Manager or Head of employee
              </p>
              <div className="d-flex">
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Manager Designation
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="managerDesignation"
                      value={formik.values.managerDesignation}
                      label="managerDesignation"
                      onChange={(event) => {
                        formik.handleChange(event);
                        filterManager(
                          event.target.value,
                          formik.values.managerDepartment
                        );
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.managerDesignation &&
                        Boolean(formik.errors.managerDesignation)
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
                  {formik.touched.managerDesignation &&
                  formik.errors.managerDesignation ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.managerDesignation}
                    </p>
                  ) : null}
                </div>
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Manager Department
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="managerDepartment"
                      value={formik.values.managerDepartment}
                      label="Manager Department"
                      onChange={(event) => {
                        formik.handleChange(event);
                        filterManager(
                          formik.values.managerDesignation,
                          event.target.value
                        );
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.managerDepartment &&
                        Boolean(formik.errors.managerDepartment)
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
                  {formik.touched.managerDepartment &&
                  formik.errors.managerDepartment ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.managerDepartment}
                    </p>
                  ) : null}
                </div>
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Find Manager
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="managerId"
                      value={formik.values.managerId}
                      label="Find Manager"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.managerId &&
                        Boolean(formik.errors.managerId)
                      }
                    >
                      {findManager?.map((value, index) => {
                        return (
                          <MenuItem key={index} value={value._id}>
                            {value.fullname}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {formik.touched.managerId && formik.errors.managerId ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.managerId}
                    </p>
                  ) : null}
                </div>
              </div>
              <p style={{ fontSize: "14px", margin: "0px", padding: "0px" }}>
                Note: Select Manager Department and Select Manager Designation
                both for filtering manager
              </p>
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="Work experience"
                name="workexperience"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.workexperience}
                error={
                  formik.touched.workexperience &&
                  Boolean(formik.errors.workexperience)
                }
              />
              <p style={{ fontSize: "14px", margin: "0px", padding: "0px" }}>
                Note: Enter month over here
              </p>
              {formik.touched.workexperience && formik.errors.workexperience ? (
                <p className="error">{formik.errors.workexperience}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="Company Name where you worked before"
                name="workexp_where"
                type="text"
                multiline
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.workexp_where}
                error={
                  formik.touched.workexp_where &&
                  Boolean(formik.errors.workexp_where)
                }
              />
              <p style={{ fontSize: "14px" }}>
                Note: you can add multiple companies name as well add duration
              </p>
              {formik.touched.workexp_where && formik.errors.workexp_where ? (
                <p className="error">{formik.errors.workexp_where}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="Education Detail"
                name="study_info"
                type="text"
                multiline
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.study_info}
                error={
                  formik.touched.study_info && Boolean(formik.errors.study_info)
                }
                required
              />
              {formik.touched.study_info && formik.errors.study_info ? (
                <p className="error">{formik.errors.study_info}</p>
              ) : null}
            </div>

            <div className="mt-3 card p-2">
              <div className="row justify-content-center gy-2">
                <p style={{ margin: "1.5px" }}>Salary Details:</p>
                <div className="col-lg-4 col-md-4 col-6">
                  <TextField
                    label="work hours per day"
                    variant="outlined"
                    type="number"
                    name="hoursperday"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.hoursperday}
                    error={
                      formik.touched.hoursperday &&
                      Boolean(formik.errors.hoursperday)
                    }
                  />
                  {formik.touched.hoursperday && formik.errors.hoursperday ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.hoursperday}
                    </p>
                  ) : null}
                </div>
                <div className="col-lg-4 col-md-4 col-6">
                  <TextField
                    label="working Day in a week"
                    variant="outlined"
                    type="number"
                    name="workdaysinweek"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.workdaysinweek}
                    error={
                      formik.touched.workdaysinweek &&
                      Boolean(formik.errors.workdaysinweek)
                    }
                  />
                  {formik.touched.workdaysinweek &&
                  formik.errors.workdaysinweek ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.workdaysinweek}
                    </p>
                  ) : null}
                </div>
                <div className="col-lg-4 col-md-4 col-6">
                  <TextField
                    label="Hourly Salary"
                    variant="outlined"
                    type="number"
                    name="hourlysalary"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.hourlysalary}
                    error={
                      formik.touched.hourlysalary &&
                      Boolean(formik.errors.hourlysalary)
                    }
                  />
                  {formik.touched.hourlysalary && formik.errors.hourlysalary ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.hourlysalary}
                    </p>
                  ) : null}
                </div>
                <div className="col-lg-4 col-md-4 col-6">
                  <TextField
                    label="Avg Weekly Salary"
                    variant="outlined"
                    type="number"
                    name="weeklysalary"
                    value={
                      formik.values.hourlysalary *
                      formik.values.hoursperday *
                      formik.values.workdaysinweek
                    }
                  />
                </div>
                <div className="col-lg-4 col-md-4 col-6">
                  <TextField
                    label="Avg Monthly Salary"
                    variant="outlined"
                    type="number"
                    name="monthlysalary"
                    value={
                      formik.values.hourlysalary *
                      formik.values.hoursperday *
                      formik.values.workdaysinweek *
                      4
                    }
                  />
                </div>
                <div className="col-lg-4 col-md-4 col-6 ">
                  <TextField
                    label="Avg Yearly Salary"
                    variant="outlined"
                    name="yearlysalary"
                    type="number"
                    value={
                      formik.values.hourlysalary *
                      formik.values.hoursperday *
                      formik.values.workdaysinweek *
                      4 *
                      12
                    }
                  />
                </div>
                <div className="col-lg-4 col-md-4 col-6 pe-lg-5">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Currany
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="currency"
                      label="currency"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.currency}
                      error={
                        formik.touched.currency &&
                        Boolean(formik.errors.currency)
                      }
                    >
                      {currency_list.map((value, index) => {
                        //console.log(value);
                        return (
                          <MenuItem
                            key={index}
                            value={`(${value.code}/${value.symbol})${value.name}`}
                          >
                            {`${value.name}(${value.symbol})`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {formik.touched.currency && formik.errors.currency ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.currency}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="Remark"
                name="remark"
                multiline
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.remark}
                error={formik.touched.remark && Boolean(formik.errors.remark)}
              />
              {formik.touched.remark && formik.errors.remark ? (
                <p className="error">{formik.errors.remark}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="Add something about employee"
                name="otherDetail"
                type="text"
                multiline
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.otherDetail}
                error={
                  formik.touched.otherDetail &&
                  Boolean(formik.errors.otherDetail)
                }
              />
              {formik.touched.otherDetail && formik.errors.otherDetail ? (
                <p className="error">{formik.errors.otherDetail}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="Joining Date"
                name="joiningDate"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.joiningDate}
                error={
                  formik.touched.joiningDate &&
                  Boolean(formik.errors.joiningDate)
                }
              />
              {formik.touched.joiningDate && formik.errors.joiningDate ? (
                <p className="error">{formik.errors.joiningDate}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="leaving Date"
                name="leavingDate"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.leavingDate}
                error={
                  formik.touched.leavingDate &&
                  Boolean(formik.errors.leavingDate)
                }
              />
              <p style={{ fontSize: "14px", margin: "0px", padding: "0px" }}>
                Note: If Employee is leaving company set leaving date and update
              </p>
              {formik.touched.leavingDate && formik.errors.leavingDate ? (
                <p className="error">{formik.errors.leavingDate}</p>
              ) : null}
            </div>
            <DialogActions>
              <Button
                onClick={handleClose}
                variant="contained"
                className="me-2"
              >
                Cancel
              </Button>
              <div className="my-3 text-center">
                {loading ? (
                  <CircularProgress style={{ color: "#1d366d" }} />
                ) : (
                  <Button type="submit" variant="contained">
                    Update
                  </Button>
                )}
              </div>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReplaceManager({ getEmps }) {
  const dispatch = useDispatch();
  const designations = useSelector((state) => state.designation.value);
  const [oldfindManager, setOldFindManager] = useState([]);
  const [newfindManager, setNewFindManager] = useState([]);
  const departments = useSelector((state) => state.department.value);
  const [loading, changeLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldManager: "",
      newManager: "",
      oldManagerDepartment: "",
      oldManagerDesignation: "",
      newManagerDepartment: "",
      newManagerDesignation: "",
    },
    validationSchema: yup.object({
      oldManager: yup.string().required("Required"),
      newManager: yup.string().required("Required"),
      oldManagerDepartment: yup.string().required("Required"),
      oldManagerDesignation: yup.string().required("Required"),
      newManagerDepartment: yup.string().required("Required"),
      newManagerDesignation: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      // console.log(values);
      try {
        changeLoading(true);
        const result = await instance.put(
          "/api/company/manageemp/replacemanager",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          changeLoading(false);
          notifySuccess(result.data.result);
          formik.resetForm();
          handleClose();
          getEmps();
        }
      } catch (err) {
        changeLoading(false);
        notifyError(err.response.data.message);
        if (
          err.response.data.message == "invalid token" ||
          err.response.data.message == "Access Denied! Unauthorized User"
        ) {
          dispatch(isAuthenticated({ auth: false }));
        }
      }
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function oldfilterManager(designation, department) {
    //  console.log(designationid, departmentid);
    formik.setFieldValue("oldManager", "");
    if (designation && department) {
      const value = { designation, department };
      // console.log(value);
      try {
        const result = await instance.post(
          "/api/company/manageemp/findemp",
          value,
          {
            withCredentials: true,
          }
        );
        if (result) {
          setOldFindManager(result.data.result);
        }
      } catch (err) {
        setOldFindManager();
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

  async function newfilterManager(designation, department) {
    //  console.log(designationid, departmentid);
    formik.setFieldValue("newManager", "");
    if (designation && department) {
      const value = { designation, department };
      // console.log(value);
      try {
        const result = await instance.post(
          "/api/company/manageemp/findemp",
          value,
          {
            withCredentials: true,
          }
        );
        if (result) {
          setNewFindManager(result.data.result);
        }
      } catch (err) {
        setNewFindManager();
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
    <div>
      <Button variant="contained" className="m-2" onClick={handleClickOpen}>
        Replace Manager
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle className="text-center">Replace Manager</DialogTitle>
          <DialogContent>
            <div className="mt-3 card p-2">
              <p style={{ margin: "1.5px" }} className="mb-2">
                Select Old Manager Details
              </p>
              <div className="d-flex">
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Designation
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="oldManagerDesignation"
                      value={formik.values.oldManagerDesignation}
                      label="oldManagerDesignation"
                      onChange={(event) => {
                        formik.handleChange(event);
                        oldfilterManager(
                          event.target.value,
                          formik.values.oldManagerDepartment
                        );
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.oldManagerDesignation &&
                        Boolean(formik.errors.oldManagerDesignation)
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
                  {formik.touched.oldManagerDesignation &&
                  formik.errors.oldManagerDesignation ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.oldManagerDesignation}
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
                      name="oldManagerDepartment"
                      value={formik.values.oldManagerDepartment}
                      label="oldManagerDepartment"
                      onChange={(event) => {
                        formik.handleChange(event);
                        oldfilterManager(
                          formik.values.oldManagerDesignation,
                          event.target.value
                        );
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.oldManagerDepartment &&
                        Boolean(formik.errors.oldManagerDepartment)
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
                  {formik.touched.oldManagerDepartment &&
                  formik.errors.oldManagerDepartment ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.oldManagerDepartment}
                    </p>
                  ) : null}
                </div>
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Find Manager
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="oldManager"
                      value={formik.values.oldManager}
                      label="Find Manager"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.oldManager &&
                        Boolean(formik.errors.oldManager)
                      }
                    >
                      {oldfindManager?.map((value, index) => {
                        return (
                          <MenuItem key={index} value={value._id}>
                            {value.fullname}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {formik.touched.oldManager && formik.errors.oldManager ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.oldManager}
                    </p>
                  ) : null}
                </div>
              </div>
              <p style={{ fontSize: "14px", margin: "0px", padding: "0px" }}>
                Note: Select Designation and Department both for filtering
                manager
              </p>
            </div>
            <div className="mt-3 card p-2">
              <p style={{ margin: "1.5px" }} className="mb-2">
                Select New Manager Details
              </p>
              <div className="d-flex">
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Designation
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="newManagerDesignation"
                      value={formik.values.newManagerDesignation}
                      label="managerDesignation"
                      onChange={(event) => {
                        formik.handleChange(event);
                        newfilterManager(
                          event.target.value,
                          formik.values.newManagerDepartment
                        );
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.newManagerDesignation &&
                        Boolean(formik.errors.newManagerDesignation)
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
                  {formik.touched.newManagerDesignation &&
                  formik.errors.newManagerDesignation ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.newManagerDesignation}
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
                      name="newManagerDepartment"
                      value={formik.values.newManagerDepartment}
                      label="Manager Department"
                      onChange={(event) => {
                        formik.handleChange(event);
                        newfilterManager(
                          formik.values.newManagerDesignation,
                          event.target.value
                        );
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.newManagerDepartment &&
                        Boolean(formik.errors.newManagerDepartment)
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
                  {formik.touched.newManagerDepartment &&
                  formik.errors.newManagerDepartment ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.newManagerDepartment}
                    </p>
                  ) : null}
                </div>
                <div className="w-100 me-1">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Find Manager
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      name="newManager"
                      value={formik.values.newManager}
                      label="Find Manager"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.newManager &&
                        Boolean(formik.errors.newManager)
                      }
                    >
                      {newfindManager?.map((value, index) => {
                        return (
                          <MenuItem key={index} value={value._id}>
                            {value.fullname}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {formik.touched.newManager && formik.errors.newManager ? (
                    <p className="error" style={{ margin: "0px" }}>
                      {formik.errors.newManager}
                    </p>
                  ) : null}
                </div>
              </div>
              <p style={{ fontSize: "14px", margin: "0px", padding: "0px" }}>
                Note: Select Designation and Department both for filtering
                manager
              </p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <div className="mx-2">
              {loading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button type="submit" disabled={formik.isSubmitting}>
                  Replace
                </Button>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default ViewEditemp;
export { EmpNav };
