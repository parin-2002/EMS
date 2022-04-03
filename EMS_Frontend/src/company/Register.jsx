import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./Register.css";
import { Link } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import instance from "../others/baseUrl";
import CircularProgress from "@mui/material/CircularProgress";
import OtpInput from "react-otp-input";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router";
import { notifySuccess, notifyError, notifyInfo } from "../notification/notify";

function Register() {
  const [loading, changeLoading] = useState(false);
  const [links, setLinks] = useState([{ platform: "", link: "" }]);
  const [mobileno, setMobileno] = useState();
  const [showOtpbox, setShowotpbox] = useState(false);
  const [email, setEmail] = useState();
  function handleChange(index, event) {
    const values = [...links];
    values[index][event.target.name] = event.target.value;
    setLinks(values);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      mobileno: "",
      address: "",
      password: "",
      cpassword: "",
      aboutcompany: "",
      numberOfemployees: "",
      links: "",
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .min(5, "minimum 5 character required")
        .max(50, "maximum 50 charcter allowed")
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
        .max(500, "maximum 500 character")
        .required("Required"),
      password: yup
        .string()
        .min(8, "minimun 8 character")
        .max(16, "maximum 16 character")
        .required("Required"),
      cpassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Does not match with password")
        .required("Required"),
      aboutcompany: yup
        .string()
        .min(50, "minimum 50 character")
        .max(500, "maximum 500 character")
        .required("Required"),
      numberOfemployees: yup
        .number()
        .positive("invalid")
        .integer()
        .min(1, "must have valid digits")
        .required("Required"),
      // icon: yup
      //   .mixed()
      //   .test(
      //     "filesize",
      //     "file too large",
      //     (value) => value && value.size <= 160 * 1024
      //   )
      //   .test(
      //     "fileFormat",
      //     "Unsupported Format",
      //     (value) =>
      //       value &&
      //       ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
      //   )
      //   .required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        changeLoading(true);
        values.links = links;
        // console.log(values);
        let result = await instance.post("/api/company/register", values);
        //console.log(result.data.result.email);
        if (result) {
          setEmail(result.data.result.email);
          setShowotpbox(true);
          formik.resetForm();
          setLinks([{ platform: "", link: "" }]);
          setMobileno();
          changeLoading(false);
          notifyInfo("Check your mail box");
        }
      } catch (err) {
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
  return (
    <>
      {showOtpbox ? <GetOtp email={email} /> : undefined}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="box col-lg-8 col-md-9 col-sm-11 col-11">
            <h1 className="text-center h1-reg">
              <i className="fas fa-users pe-2"></i>
              EMS
            </h1>
            <p className="text-center my-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cupiditate quasi totam, adipisci accusamus commodi officiis
              dignissimos aliquid labore? Inventore cupiditate corporis vel amet
            </p>
            <h5 className="h5-reg">Company Registation Form</h5>
            <div className="from my-2 mx-lg-5 mx-2">
              <form className="mx-lg-5" onSubmit={formik.handleSubmit}>
                <div className="mt-3">
                  <TextField
                    className="form-control"
                    label="Company Name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    required
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="error">{formik.errors.name}</p>
                  ) : null}
                </div>

                <div className="mt-3">
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
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    required
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <p className="error">{formik.errors.address}</p>
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

                <div className="mt-3">
                  <TextField
                    className="form-control"
                    label="Confirm Password"
                    name="cpassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cpassword}
                    error={
                      formik.touched.cpassword &&
                      Boolean(formik.errors.cpassword)
                    }
                    autoComplete="true"
                    required
                  />
                  {formik.touched.cpassword && formik.errors.cpassword ? (
                    <p className="error">{formik.errors.cpassword}</p>
                  ) : null}
                </div>

                <div className="mt-3">
                  <TextField
                    className="form-control"
                    label="Tell about company"
                    name="aboutcompany"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.aboutcompany}
                    error={
                      formik.touched.aboutcompany &&
                      Boolean(formik.errors.aboutcompany)
                    }
                    multiline
                    required
                  />
                  {formik.touched.aboutcompany && formik.errors.aboutcompany ? (
                    <p className="error">{formik.errors.aboutcompany}</p>
                  ) : null}
                </div>

                <div className="mt-3">
                  <TextField
                    className="form-control"
                    label="numberOfemployees"
                    name="numberOfemployees"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.numberOfemployees}
                    error={
                      formik.touched.numberOfemployees &&
                      Boolean(formik.errors.numberOfemployees)
                    }
                    required
                  />
                  {formik.touched.numberOfemployees &&
                  formik.errors.numberOfemployees ? (
                    <p className="error">{formik.errors.numberOfemployees}</p>
                  ) : null}
                </div>

                {/* <div className="mt-3">
                  <TextField
                    className="form-control file"
                    id="outlined-required"
                    label="Icon of the company"
                    name="icon"
                    type="file"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => {
                      formik.setFieldValue("icon", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.icon && Boolean(formik.errors.icon)}
                    required
                  />
                  {formik.touched.icon && formik.errors.icon ? (
                    <p className="error">{formik.errors.icon}</p>
                  ) : null}
                </div> */}

                {links.map((data, index) => {
                  return (
                    <div key={index}>
                      <div key={index} className="mt-3 row">
                        <div className="col-4 ">
                          <TextField
                            style={{ width: "100%" }}
                            label="Social Media"
                            name="platform"
                            type="text"
                            value={data.platform}
                            onChange={(event) => {
                              handleChange(index, event);
                              formik.setFieldValue("links", links);
                            }}
                            className="me-2"
                          />
                        </div>
                        <div
                          className="col-7"
                          style={{ position: "relative", left: "-20px" }}
                        >
                          <TextField
                            style={{ width: "100%" }}
                            label="Link"
                            name="link"
                            type="text"
                            value={data.link}
                            onChange={(event) => {
                              handleChange(index, event);
                              formik.setFieldValue("links", links);
                            }}
                            className="me-2"
                          />
                        </div>
                        <div
                          className="col-1 d-flex"
                          style={{
                            margin: "15px 0px 0px -40px",
                          }}
                        >
                          <RemoveIcon
                            onClick={() => {
                              if (links.length != 1) {
                                const values = [...links];
                                values.splice(index, 1);
                                setLinks(values);
                                formik.setFieldValue("links", links);
                              }
                            }}
                            style={{
                              fontSize: "30px",
                              background: "#387cf7",
                              color: "white",
                              margin: "1px",
                            }}
                          />

                          <AddIcon
                            onClick={() => {
                              setLinks((old) => {
                                return [...old, { platform: "", link: "" }];
                              });
                            }}
                            style={{
                              fontSize: "30px",
                              background: "#387cf7",
                              color: "white",
                              margin: "1px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

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
        </div>
      </div>
      <p className="text-center mt-3 mb-5">
        <Link to="/companylogin">Already have an account</Link>
      </p>
    </>
  );
}

function GetOtp(props) {
  // console.log(props);
  const [loading, changeLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [error, setError] = useState();
  const [otp, setOtp] = useState();
  const [resendOtpmsg, setresendOtpmsg] = useState();
  let navigate = useNavigate();

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
        let result = await instance.post("/api/company/verifyRegistation", {
          email: props.email,
          otp: otp,
        });
        if (
          result.data.success == 1 &&
          result.data.message == "Account verified successfully"
        ) {
          changeLoading(false);
          setOpen(false);
          navigate("/companylogin");
          notifySuccess("Account created successfuly");
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
      let result = await instance.post("/api/company/resendotp", {
        email: props.email,
      });
      setresendOtpmsg(result.data.message);
      notifySuccess(result.data.message);
    } catch (err) {
      setresendOtpmsg(err.response.data.message);
      notifyError(err.response.data.message);
    }
  }

  return (
    <div>
      <Dialog open={open} className="text-center">
        <DialogTitle>Registation Verification</DialogTitle>
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
              <Button onClick={reSend}>Resend</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Register;
