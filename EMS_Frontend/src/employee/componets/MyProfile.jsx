import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import instance from "../../others/baseUrl";
import CircularProgress from "@mui/material/CircularProgress";
import { notifyError, notifySuccess } from "../../notification/notify";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Input = styled("input")({
  display: "none",
});

function MyProfile({ getEmp }) {
  const empprofile = useSelector((state) => state.empprofile.value);
  const managerdetail = useSelector((state) => state.managerdetail.value);
  const [progress, setProgress] = useState(false);
  const [picture, setPicture] = useState(empprofile.profilepic);

  async function uploadPicture(event) {
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
            const result = await instance.put("/api/emp/updatepicture", fd, {
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
                setPicture(reader.result);
              };
              getEmp();
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
    }
  }

  return (
    <>
      <div className="box">
        <div className="h5-com mt-2 d-flex justify-content-center">
          <AccountCircleIcon className="me-2" style={{ fontSize: "30px" }} />
          <h3>My Profile</h3>
        </div>
        <div className="row mt-5">
          <div className="col-lg-3 col-md-3">
            <div style={{ width: "150px" }} className="mx-auto">
              <img
                width="100%"
                style={{ borderRadius: "50%", border: "1px solid #1d366d" }}
                src={picture}
                alt="img"
              />
            </div>
            <div className="text-center mb-4 mt-2">
              {progress ? (
                <CircularProgress style={{ color: "#1d366d" }} />
              ) : (
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    onChange={uploadPicture}
                  />
                  <Button variant="contained" component="span">
                    <PhotoCamera />
                  </Button>
                </label>
              )}
            </div>
          </div>
          <div className="col-lg-8 col-md-8">
            <div className="mx-2 mb-5">
              <h3 className="h5-com bold">My Details</h3>
              <div>
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#1d366d",
                  }}
                >
                  Name:
                </span>
                <p>{empprofile.fullname}</p>
              </div>
              <div>
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#1d366d",
                  }}
                >
                  Email:
                </span>
                <p>{empprofile.email}</p>
              </div>
              <div>
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#1d366d",
                  }}
                >
                  Mobileno:
                </span>
                <p>{empprofile.mobileno}</p>
              </div>
              <div>
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#1d366d",
                  }}
                >
                  Address:
                </span>
                <p>{empprofile.address}</p>
              </div>
              <div>
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#1d366d",
                  }}
                >
                  Gender:
                </span>
                <p>{empprofile.gender}</p>
              </div>
              <div>
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#1d366d",
                  }}
                >
                  Qualification:
                </span>
                <p>{empprofile.study_info}</p>
              </div>
              <div>
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#1d366d",
                  }}
                >
                  Joining Date:
                </span>
                <p>{new Date(empprofile.joiningDate).toDateString()}</p>
              </div>

              {empprofile.leavingDate ? (
                <div>
                  <span
                    style={{
                      marginRight: "8px",
                      fontSize: "17px",
                      fontWeight: "600",
                      color: "#1d366d",
                    }}
                  >
                    Leaving Date:
                  </span>
                  <p>{new Date(empprofile.leavingDate).toDateString()}</p>
                </div>
              ) : (
                ""
              )}

              {managerdetail.fullname ? (
                <div className="mt-2">
                  <h3 className="h5-com bold">Manager Details</h3>
                  <div>
                    <span
                      style={{
                        marginRight: "8px",
                        fontSize: "17px",
                        fontWeight: "600",
                        color: "#1d366d",
                      }}
                    >
                      Name:
                    </span>
                    <p>{managerdetail.fullname}</p>
                  </div>
                  <div>
                    <span
                      style={{
                        marginRight: "8px",
                        fontSize: "17px",
                        fontWeight: "600",
                        color: "#1d366d",
                      }}
                    >
                      Email:
                    </span>
                    <p>{managerdetail.email}</p>
                  </div>
                  <div>
                    <span
                      style={{
                        marginRight: "8px",
                        fontSize: "17px",
                        fontWeight: "600",
                        color: "#1d366d",
                      }}
                    >
                      Mobileno:
                    </span>
                    <p>{managerdetail.mobileno}</p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            <UpdatePassword />
          </div>
        </div>
      </div>
    </>
  );
}

function UpdatePassword() {
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
        const result = await instance.put("/api/emp/updatepassword", value, {
          withCredentials: true,
        });
        if (result) {
          setLoading(false);
          notifySuccess(result.data.result);
          formik.resetForm();
        }
      } catch (err) {
        setLoading(false);
        notifyError(err.response.data.message);
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

export default MyProfile;
