import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useFormik } from "formik";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import instance from "../../others/baseUrl";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import OtpInput from "react-otp-input";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LockIcon from "@mui/icons-material/Lock";
import { styled } from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import {
  notifyInfo,
  notifySuccess,
  notifyError,
  notifyWarn,
} from "../../notification/notify";
import { useSelector, useDispatch } from "react-redux";
import { isAuthenticated } from "../../redux/auth";

const Input = styled("input")({
  display: "none",
});

function Profile({ getCompanyProfile }) {
  const dispatch = useDispatch();
  let companyprofiledata = useSelector(
    (state) => state.companyprofiledata.value
  );
  // console.log(companyprofiledata);
  const [links, setLinks] = useState(companyprofiledata.links);
  const [mobileno, setMobileno] = useState(companyprofiledata.mobileno);
  const [loading, changeLoading] = useState(false);
  const [email, setEmail] = useState(companyprofiledata.email?.toLowerCase());
  const [showOtpbox, setShowotpbox] = useState(false);
  const [icon, setIcon] = useState(companyprofiledata.icon);
  const [progress, setProgress] = useState(false);
  const [linkChange, setLinkChange] = useState(false);

  function handleChange(index, event) {
    setLinkChange(true);
    const values = [...links];
    values[index] = { ...values[index] };
    values[index][event.target.name] = event.target.value;
    setLinks(values);
  }

  function closeOtpBox() {
    setShowotpbox(false);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: companyprofiledata.name,
      email: companyprofiledata.email,
      mobileno: companyprofiledata.mobileno,
      address: companyprofiledata.address,
      aboutcompany: companyprofiledata.aboutcompany,
      numberOfemployees: companyprofiledata.numberOfemployees,
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
    }),

    onSubmit: async (values) => {
      changeLoading(true);
      try {
        values.links = links;
        if (
          companyprofiledata.name != values.name ||
          companyprofiledata.email.toLowerCase() !=
            values.email.toLowerCase() ||
          companyprofiledata.mobileno != values.mobileno ||
          companyprofiledata.aboutcompany != values.aboutcompany ||
          companyprofiledata.address != values.address ||
          companyprofiledata.numberOfemployees != values.numberOfemployees ||
          linkChange
        ) {
          // console.table(companyprofiledata, values);
          if (email == values.email.toLowerCase()) {
            //  console.log("same");
            const result = await instance.put(
              "/api/company/editaccount",
              values,
              { withCredentials: true }
            );
            if (result) {
              changeLoading(false);
              notifySuccess(result.data.result);
              getCompanyProfile();
              setLinkChange(false);
            }
          } else {
            // console.log("different");
            const result = await instance.put(
              "/api/company/editaccount",
              values,
              { withCredentials: true }
            );
            if (result) {
              setEmail(values.email);
              setShowotpbox(true);
              changeLoading(false);
              getCompanyProfile();
              setLinkChange(false);
              notifyWarn("you must re-verify email if you update your email");
              // console.log(result);
            }
          }
        } else {
          changeLoading(false);
          notifyInfo("no update found");
        }
      } catch (err) {
        if (
          err.response.data.message == "invalid token" ||
          err.response.data.message == "Access Denied! Unauthorized User"
        ) {
          dispatch(isAuthenticated({ auth: false }));
        }
        changeLoading(false);
        //console.log(err.response.data);
        const message = err.response.data.message;
        if (
          message.includes("Plan executor error during findAndModify") &&
          message.includes("email")
        ) {
          formik.setFieldValue("email", companyprofiledata.email);
          notifyError("email alarady exists");
        } else if (
          message.includes("Plan executor error during findAndModify") &&
          message.includes("mobileno")
        ) {
          formik.setFieldValue("mobileno", companyprofiledata.mobileno);
          setMobileno(companyprofiledata.mobileno);
          notifyError("mobileno alarady exists");
        } else {
          getCompanyProfile();
          notifyError(message);
        }
      }
    },
  });

  async function uploadIcon(event) {
    try {
      if (event.target.files[0]) {
        setProgress(true);
        var selectedFile = event.target.files[0];
        //  console.log(selectedFile);
        if (
          selectedFile.type.includes("jpeg") ||
          selectedFile.type.includes("svg") ||
          selectedFile.type.includes("png") ||
          selectedFile.type.includes("jpg")
        ) {
          if (selectedFile.size < 100000) {
            const fd = new FormData();
            fd.append("file", selectedFile, selectedFile.name);
            const result = await instance.put("/api/company/updateicon", fd, {
              withCredentials: true,
              onUploadProgress: (ProgressEvent) => {
                // console.log(
                //   (ProgressEvent.loaded / ProgressEvent.total) * 100
                // );
              },
            });
            //  console.log(result);
            if (result) {
              var reader = new FileReader();
              var url = reader.readAsDataURL(selectedFile);
              reader.onloadend = (e) => {
                setIcon(reader.result);
              };
              getCompanyProfile();
              setProgress(false);
            }
          } else {
            setProgress(false);
            notifyError("large file");
          }
        } else {
          setProgress(false);
          notifyError("invalid formate");
        }
      } else {
        setProgress(false);
        // alert("file required");
      }
    } catch (err) {
      console.log(err.response.data);
      if (
        err.response.data.message == "invalid token" ||
        err.response.data.message == "Access Denied! Unauthorized User"
      ) {
        dispatch(isAuthenticated({ auth: false }));
      }
    }
  }

  return (
    <>
      {showOtpbox ? (
        <GetOtp email={email} closeOtpBox={closeOtpBox} />
      ) : undefined}
      <div className="box">
        <div className=" d-flex justify-content-center align-items-center h5-com">
          <AccountCircleIcon style={{ fontSize: "45px" }} />
          <h1 style={{ margin: "2px" }}>Profile</h1>
        </div>

        <div className="row">
          <div className="col-lg-2 me-lg-3 me-md-3 col-md-3 col-12">
            <div className="com_icon my-2 mt-5 text-center">
              <img width="100%" src={icon} />
            </div>
            <div className="text-center mb-4">
              {progress ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    onChange={uploadIcon}
                  />
                  <Button variant="contained" component="span">
                    <PhotoCamera />
                  </Button>
                </label>
              )}
            </div>
          </div>
          <div className="col-lg col-md col-sm-12 col-12 mt-lg-4 mt-md-5 md-md-4">
            <h3 className="h5-com text-lg-start text-md-start text-center">
              <AppRegistrationIcon
                style={{
                  fontSize: "30px",
                  marginRight: "8px",
                  marginBottom: "4px",
                }}
              />
              Edit & View profile
            </h3>
            <div className="me-lg-5 me-md-3">
              <form onSubmit={formik.handleSubmit}>
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

                {links.map((data, index) => {
                  return (
                    <div key={index}>
                      <div key={index} className="mt-3 row">
                        <div className="col-4 ">
                          <TextField
                            style={{ width: "100%" }}
                            label="Platform"
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
                                setLinkChange(true);
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
                              setLinkChange(true);
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
                      // disabled={formik.isSubmitting}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </form>
              <UpdatePassword />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function GetOtp(props) {
  // console.log(props);
  const [loading, changeLoading] = useState(false);
  const [resendloading, setResendloading] = useState(false);
  const [open, setOpen] = useState(true);
  const [error, setError] = useState();
  const [otp, setOtp] = useState();
  const [resendOtpmsg, setresendOtpmsg] = useState();

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
          props.closeOtpBox();
          notifySuccess("Email verified successfuly");
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
        email: props.email,
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
        <DialogTitle>Email Verification</DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-3">
            <LockIcon style={{ fontSize: "40px", color: "#1d366d" }}></LockIcon>
            <br />
            Enter otp here and it is valid for 4 minutes if you do not verify
            email you will not be able to login so please verify new Email
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

function UpdatePassword() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldpassword: "",
      newpassword: "",
      cnewpassword: "",
    },

    validationSchema: yup.object({
      oldpassword: yup
        .string()
        .min(8, "minimun 8 character")
        .max(16, "maximum 16 character")
        .required("Required"),
      newpassword: yup
        .string()
        .min(8, "minimun 8 character")
        .max(16, "maximum 16 character")
        .required("Required"),
      cnewpassword: yup
        .string()
        .oneOf([yup.ref("newpassword"), null], "Does not match with password")
        .required("Required"),
    }),
    onSubmit: async (value) => {
      setLoading(true);
      try {
        const result = await instance.put(
          "/api/company/updatepassword",
          value,
          {
            withCredentials: true,
          }
        );
        if (result) {
          setLoading(false);
          notifySuccess(result.data.result);
          formik.resetForm();
        }
      } catch (err) {
        setLoading(false);
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

  return (
    <>
      <div className="">
        <h3 className="h5-com" style={{ margin: "2px" }}>
          <EditIcon
            style={{
              fontSize: "28px",
              marginRight: "8px",
              marginBottom: "4px",
            }}
          />
          Change Password
        </h3>
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-3">
              <TextField
                className="form-control"
                label="Old Password"
                name="oldpassword"
                type="password"
                autoComplete="true"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.oldpassword}
                error={
                  formik.touched.oldpassword &&
                  Boolean(formik.errors.oldpassword)
                }
                required
              />
              {formik.touched.oldpassword && formik.errors.oldpassword ? (
                <p className="error">{formik.errors.oldpassword}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="New Password"
                name="newpassword"
                type="password"
                autoComplete="true"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newpassword}
                error={
                  formik.touched.newpassword &&
                  Boolean(formik.errors.newpassword)
                }
                required
              />
              {formik.touched.newpassword && formik.errors.newpassword ? (
                <p className="error">{formik.errors.newpassword}</p>
              ) : null}
            </div>

            <div className="mt-3">
              <TextField
                className="form-control"
                label="Confirm New Password"
                name="cnewpassword"
                type="password"
                autoComplete="true"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cnewpassword}
                error={
                  formik.touched.cnewpassword &&
                  Boolean(formik.errors.cnewpassword)
                }
                required
              />
              {formik.touched.cnewpassword && formik.errors.cnewpassword ? (
                <p className="error">{formik.errors.cnewpassword}</p>
              ) : null}
            </div>

            <div className="my-3 text-center">
              {loading ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  // disabled={formik.isSubmitting}
                >
                  Update
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
