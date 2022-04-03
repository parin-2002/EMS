import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./Login.css";
import { Link } from "react-router-dom";
// dialog or popup for forget password
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import instance from "../others/baseUrl";
import OtpInput from "react-otp-input";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch } from "react-redux";
import { isAuthenticated } from "../redux/auth";
import { useNavigate } from "react-router";
import { notifyError, notifySuccess, notifyInfo } from "../notification/notify";

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
      let result = await instance.post("/api/company/forgotpassword", data);
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

function Login() {
  const [loading, changeLoading] = useState(false);
  const [showOtpbox, setShowotpbox] = useState(false);
  const [loginData, setLogindata] = useState();

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
        let result = await instance.post("/api/company/login", values);
        // console.log(result.data.result);
        if (result) {
          setLogindata({
            email: result.data.result.email,
            password: result.data.result.password,
          });
          setShowotpbox(true);
          formik.resetForm();
          changeLoading(false);
          notifyInfo("Check your mail box");
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
      {showOtpbox ? <GetOtp loginData={loginData} /> : undefined}
      <div className="container center-box">
        <div className="row box col-lg-7 col-md-9 col-sm-10 col-10">
          <h3 className="h5-reg">Login for company</h3>
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
          <Link to="/companyregister">Don't have an account</Link>
          <ForgotPassword />
        </div>
      </div>
    </>
  );
}

function GetOtp(props) {
  //console.log(props);
  const [loading, changeLoading] = useState(false);
  const [resendloading, setResendloading] = useState(false);
  const [open, setOpen] = useState(true);
  const [error, setError] = useState();
  const [otp, setOtp] = useState();
  const [resendOtpmsg, setresendOtpmsg] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function matchOtp(event) {
    try {
      changeLoading(true);
      event.preventDefault();
      //console.log(otp);
      if (!otp || String(otp).length != 5) {
        setError("valid OTP required");
        notifyError("valid OTP required");
        changeLoading(false);
      } else {
        let result = await instance.post(
          "/api/company/verifyLogin",
          {
            ...props.loginData,
            otp: otp,
          },
          {
            withCredentials: true,
          }
        );
        if (result) {
          changeLoading(false);
          setOpen(false);
          dispatch(isAuthenticated({ auth: true }));
          navigate("/company");
          notifySuccess("Welcome To EMS");
          // console.log(result.data);
          //alert("ok");
        }
      }
    } catch (err) {
      changeLoading(false);
      setError(err.response.data.message);
      notifyError(err.response.data.message);
    }
  }

  async function reSend() {
    try {
      setResendloading(true);
      let result = await instance.post("/api/company/resendotp", {
        email: props.loginData.email,
      });
      setResendloading(false);
      setresendOtpmsg(result.data.message);
      notifySuccess(result.data.message);
    } catch (err) {
      setResendloading(false);
      setresendOtpmsg(err.response.data.message);
      notifyError(err.response.data.message);
    }
  }

  return (
    <div>
      <Dialog open={open} className="text-center">
        <DialogTitle>Login Verification</DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-3">
            <LockIcon style={{ fontSize: "40px", color: "#1d366d" }}></LockIcon>
            <br />
            Enter otp here and it is valid for 4 minutes
          </DialogContentText>
          <form onSubmit={matchOtp}>
            <div className="d-flex  justify-content-center ">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={5}
                separator={<span className="mx-2">.</span>}
                inputStyle={{
                  width: "25px",
                  height: "30px",
                  textAlign: "center",
                }}
                hasErrored={Boolean(error)}
                errorStyle={{
                  border: "1px solid red",
                  color: "red",
                }}
              />
            </div>
            <p className="error"> {error}</p>
            <p>{resendOtpmsg}</p>
            <div className="my-3 text-center">
              {loading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button type="submit" variant="contained">
                  Verify
                </Button>
              )}
              <br />
              {resendloading ? (
                <CircularProgress
                  style={{ color: "#1d366d" }}
                  className="mt-2"
                />
              ) : (
                <Button onClick={reSend} className="mt-2">
                  Resend
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Login;
