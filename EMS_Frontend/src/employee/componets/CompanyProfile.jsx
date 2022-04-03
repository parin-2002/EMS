import React from "react";
import { useSelector } from "react-redux";
import ApartmentIcon from "@mui/icons-material/Apartment";

function EcompanyProfile() {
  const companyprofile = useSelector((state) => state.companyprofile.value);

  return (
    <>
      <div className="box">
        <div className="h5-com mt-2 d-flex justify-content-center">
          <ApartmentIcon className="me-2" style={{ fontSize: "30px" }} />
          <h3>Company Details</h3>
        </div>
        <div className="row mt-5">
          <div className="col-lg-3 col-md-3">
            <div style={{ width: "150px" }} className="mx-auto">
              <img
                width="100%"
                style={{ borderRadius: "50%", border: "1px solid #1d366d" }}
                src={companyprofile.icon}
                alt="img"
              />
            </div>
          </div>
          <div className="col-lg-8 col-md-8">
            <div className=" mx-2">
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
                <p>{companyprofile.name}</p>
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
                <p>{companyprofile.email}</p>
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
                <p>{companyprofile.mobileno}</p>
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
                <p>{companyprofile.address}</p>
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
                  AboutCompany:
                </span>
                <p>{companyprofile.aboutcompany}</p>
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
                  Number Of Employees:
                </span>
                <p>{companyprofile.numberOfemployees}</p>
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
                  Social Media or Other Links:
                </span>
                <div className="d-flex">
                  {companyprofile.links?.map((one, index) => {
                    return (
                      <a
                        className="me-2"
                        target="_blank"
                        key={index}
                        href={one.link}
                      >
                        {one.platform}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EcompanyProfile;
