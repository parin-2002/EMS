import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../company/Login.css";

// dialog or popup for forget password
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import instance from "../others/baseUrl";
import { useDispatch } from "react-redux";
import { isEmpAuthenticated } from "../redux/auth";
import { useNavigate } from "react-router";
import { notifyError, notifySuccess } from "../notification/notify";

function ForgotPassword() {
  const [loading, changeLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, getData] = useState({ email: "" });
  const [error, setError] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    let value = event.target.value;
    getData({ email: value });
  };

  const handleSubmit = async (event) => {
    try {
      changeLoading(true);
      event.preventDefault();
      let result = await instance.post("/api/emp/forgotpassword", data);
      if (result) {
        changeLoading(false);
        notifySuccess(result.data.message);
        setOpen(false);
      }
    } catch (err) {
      changeLoading(false);
      setError(err.response.data.message);
      notifyError(err.response.data.message);
    }
  };

  return (
    <div>
      <a href="#" onClick={handleClickOpen}>
        Forgot password
      </a>
      <Dialog open={open}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Enter your mail id</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Make sure this email id registered with us.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              name="email"
              value={data.value}
              fullWidth
              error={Boolean(error)}
              onChange={handleChange}
              variant="standard"
              required
            />
            <p className="error">{error}</p>
          </DialogContent>
          <DialogActions className="mb-2 me-2">
            <Button onClick={handleClose}>Cancel</Button>
            {loading ? (
              <CircularProgress style={{ color: "#1d366d" }} />
            ) : (
              <Button type="submit">Get password</Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

function EmpLogin() {
  const [loading, changeLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .test("invalid email", (value) => {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        })
        .required("Required"),
      password: yup
        .string()
        .min(8, "minimun 8 character")
        .max(16, "maximum 16 character")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        // console.log(values);
        changeLoading(true);
        let result = await instance.post("/api/emp/emplogin", values, {
          withCredentials: true,
        });
        //console.log(result.data.result);
        if (result) {
          formik.resetForm();
          changeLoading(false);
          notifySuccess("Welcome To EMS");
          dispatch(isEmpAuthenticated({ auth: true }));
          navigate("/emp");
        }
      } catch (err) {
        changeLoading(false);
        // console.log(err.response.data);
        const message = err.response.data.message;
        if (message.includes("Email")) {
          formik.errors.email = message;
          notifyError(message);
        } else if (message.includes("Password")) {
          formik.errors.password = message;
          notifyError(message);
        } else {
          formik.errors.email = message;
          notifyError(message);
        }
      }
    },
  });
  return (
    <>
      <div className="container center-box">
        <div className="row box col-lg-7 col-md-9 col-sm-10 col-10">
          <h3 className="h5-reg">Login for Employee</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-2">
              <TextField
                className="form-control"
                label="Company Email"
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
              <TextField
                className="form-control"
                label="Password"
                name="password"
                type="password"
                autoComplete="true"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                required
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="error">{formik.errors.password}</p>
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
        <div className="mt-3 text-center">
          <ForgotPassword />
        </div>
      </div>
    </>
  );
}

export default EmpLogin;
