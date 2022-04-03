import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// dialog or popup for adding designation
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import currency_list from "../../../others/currencyData";
import { notifyError, notifySuccess } from "../../../notification/notify";
import instance from "../../../others/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";
import { isAuthenticated } from "../../../redux/auth";

function Designation(props) {
  const [loading, changeLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      designation: "",
      description: "",
    },
    validationSchema: yup.object({
      designation: yup.string().required("Required"),
      description: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.post(
          "/api/company/manageemp/adddesignation",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          changeLoading(false);
          notifySuccess("New Designation added");
          props.getDesignation();
          formik.resetForm();
          setOpen(false);
        }
      } catch (err) {
        changeLoading(false);
        notifyError(req.response.data.message);
        if (
          err.response.data.message == "invalid token" ||
          err.response.data.message == "Access Denied! Unauthorized User"
        ) {
          dispatch(isAuthenticated({ auth: false }));
        }
      }
    },
  });

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle className="px-5 mx-5">Add Designation</DialogTitle>
          <DialogContent>
            <div className="mt-2">
              <TextField
                variant="standard"
                fullWidth
                label="Designation"
                name="designation"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.designation}
                error={
                  formik.touched.designation &&
                  Boolean(formik.errors.designation)
                }
                required
              />
              {formik.touched.designation && formik.errors.designation ? (
                <p className="error">{formik.errors.designation}</p>
              ) : null}
            </div>

            <div className="mt-2">
              <TextField
                variant="standard"
                fullWidth
                label="Description"
                name="description"
                type="text"
                multiline
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                required
              />
              {formik.touched.description && formik.errors.description ? (
                <p className="error">{formik.errors.description}</p>
              ) : null}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <div className="mx-2">
              {loading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button type="submit" disabled={formik.isSubmitting}>
                  Add
                </Button>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

function Department(props) {
  const dispatch = useDispatch();
  const [loading, changeLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      department: "",
      description: "",
    },
    validationSchema: yup.object({
      department: yup.string().required("Required"),
      description: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.post(
          "/api/company/manageemp/adddepartment",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          changeLoading(false);
          notifySuccess("New Department added");
          props.getDepartment();
          formik.resetForm();
          setOpen(false);
        }
      } catch (err) {
        changeLoading(false);
        notifyError(req.response.data.message);
        if (
          err.response.data.message == "invalid token" ||
          err.response.data.message == "Access Denied! Unauthorized User"
        ) {
          dispatch(isAuthenticated({ auth: false }));
        }
      }
    },
  });

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle className="px-5 mx-5">Add Department</DialogTitle>
          <DialogContent>
            <div className="mt-2">
              <TextField
                variant="standard"
                fullWidth
                label="Department"
                name="department"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.department}
                error={
                  formik.touched.department && Boolean(formik.errors.department)
                }
                required
              />
              {formik.touched.department && formik.errors.department ? (
                <p className="error">{formik.errors.department}</p>
              ) : null}
            </div>

            <div className="mt-2">
              <TextField
                variant="standard"
                fullWidth
                label="Description"
                name="description"
                type="text"
                multiline
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                required
              />
              {formik.touched.description && formik.errors.description ? (
                <p className="error">{formik.errors.description}</p>
              ) : null}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <div className="mx-2">
              {loading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button type="submit" disabled={formik.isSubmitting}>
                  Add
                </Button>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

function Addemp({ getDepartment, getDesignation }) {
  const dispatch = useDispatch();
  const [loading, changeLoading] = useState(false);
  const designations = useSelector((state) => state.designation.value);
  const [findManager, setFindManager] = useState([]);
  const departments = useSelector((state) => state.department.value);
  const [mobileno, setMobileno] = useState();

  // useEffect(() => {
  //   getDepartment();
  //   getDesignation();
  // }, [1]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: "",
      email: "",
      mobileno: "",
      address: "",
      gender: "",
      designation: "",
      department: "",
      managerId: "",
      workexperience: "",
      workexp_where: "",
      study_info: "",
      remark: "",
      otherDetail: "",
      joiningDate: "",
      managerDesignation: "",
      managerDepartment: "",
      hoursperday: 0,
      workdaysinweek: 0,
      hourlysalary: 0,
      currency: "",
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
    }),
    onSubmit: async (values) => {
      try {
        changeLoading(true);
        const result = await instance.post(
          "/api/company/manageemp/addemployee",
          values,
          {
            withCredentials: true,
          }
        );
        if (result) {
          notifySuccess("New Employee added");
          formik.resetForm();
          setMobileno();
          changeLoading(false);
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
          formik.errors.email = "email alarady exists";
          notifyError("email alarady exists");
        } else if (
          message.includes("duplicate") &&
          message.includes("mobileno")
        ) {
          formik.errors.mobileno = "mobileno alarady exists";
          notifyError("mobileno alarady exists");
        } else {
          notifyError(message);
        }
      }
    },
  });

  async function filterManager(designation, department) {
    formik.setFieldValue("managerId", "");
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
    <>
      <div className="container">
        <div className="row box justify-content-center">
          <form
            className="col-lg-9 col-md-9 col-sm-10 col-12 "
            onSubmit={formik.handleSubmit}
          >
            <h5 className="text-center h5-com my-4">
              <AddBoxIcon className="mb-1" /> Add New Employee
            </h5>
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
              <div className="mt-2">
                <Designation getDesignation={getDesignation} />
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
              <div className="mt-2">
                <Department getDepartment={getDepartment} />
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

            <div className="my-3 text-center">
              {loading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Addemp;
export { Designation, Department };
