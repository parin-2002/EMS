import React from "react";
import { Link } from "react-router-dom";
import "./HomeComponets.css";

function HeaderContactInfo() {
  return (
    <>
      <div>
        <p className="headcontact ">
          <span>Email: support@ems.com</span>
          <span> | </span>
          <span>Phone: +9199874 256322</span>
        </p>
      </div>
    </>
  );
}

function HomeNav() {
  return (
    <>
      <HeaderContactInfo />
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid ms-lg-5 bg-white">
          <a className="navbar-brand ms-lg-5 ms-sm-2" href="#">
            <i className="fas fa-users"></i>
            EMS
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars menu"></i>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end "
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav">
              <li className="nav-item mx-3">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href="#Service">
                  Services
                </a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href="#About">
                  About
                </a>
              </li>
              {/* <li className="nav-item mx-3">
                <a className="nav-link" href="#">
                  Review
                </a>
              </li> */}
              <li className="nav-item mx-3">
                <a className="nav-link" href="#Contact">
                  Contact
                </a>
              </li>
            </ul>
            <div className="d-flex ms-lg-5  me-lg-5">
              <Link
                to="companyregister"
                className="btn btn-primary me-lg-5 nav-btn"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

function HomeTitle() {
  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-lg col-md col-sm-12 col-12 d-flex justify-content-center align-items-center">
            <div>
              <h4 style={{ color: "#387cf7" }}>Hello folks!</h4>
              <h1 className="title-heading">#1 Employee Management System</h1>
              <h2
                className="typewrite"
                data-period="2000"
                data-type='[ "Welcome to EMS", "Employee Management System"]'
              >
                <span className="wrap"></span>
              </h2>

              <p>
                We provide a facility to manage your employees very effectively
                as well as a lot of other functionality.
              </p>
              <div className="d-flex">
                <Link
                  to="companyregister"
                  className="btn btn-primary me-lg-5 nav-btn"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg col-md col-sm-12 col-12 d-flex justify-content-center align-items-center">
            <i className="fas fa-users title-logo"></i>
          </div>
        </div>
      </div>
    </>
  );
}

function Portals() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-6 ">
            <div className="card mt-2  shadow">
              <div className="card-body ">
                <h5 className="portal-title">
                  <i className="fas fa-building"></i> Company Portal
                </h5>
                <p className="card-text">
                  Here, Company can create an account and access all
                  functionality of EMS manage employees Company can create an
                  account and access all functionality of EMS manage employees
                  Company can create an account and access all functionality of
                  EMS manage employees.
                </p>
                <Link to="companylogin" className="btn btn-primary">
                  Go to Company portal
                </Link>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card mt-2 shadow">
              <div className="card-body">
                <h5 className="portal-title">
                  <i className="fas fa-address-card"></i> Employee Portal
                </h5>
                <p className="card-text">
                  Here, Company can create an account and access all
                  functionality of EMS manage employees Company can create an
                  account and access all functionality of EMS manage employees
                  Company can create an account and access all functionality of
                  EMS manage employees.
                </p>
                <Link to="emplogin" className="btn btn-primary">
                  Go to Employee portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Services() {
  return (
    <>
      <div
        className="container mx-auto services row justify-content-evenly"
        id="Service"
      >
        <h2 className="title-h2">Services</h2>
        <div className="col-lg col-md col-sm-5 mx-1 mt-2 pe-1 col-12 shadow">
          <i className="fas fa-calendar-alt"></i>
          <h4>Create Schedule</h4>
          <p>
            You can add public and private events and reminders on a calendar
            and create a schedule as well.
          </p>
        </div>
        <div className="col-lg col-md col-sm-5 mx-1 mt-2 pe-1   col-12 shadow">
          <i className="fas fa-user-check"></i>
          <h4>Attendance</h4>
          <p>
            company and employees can take their attendance and track their
            working hours and multiple shifts can be taken.
          </p>
        </div>
        <div className="col-lg col-md col-sm-5 mx-1 mt-2 pe-1  col-12 shadow">
          <i className="fas fa-money-check-alt"></i>
          <h4>Salary Management</h4>
          <p>
            Through attendance records, you can calculate salary and you can
            also view day-wise salary details and more.
          </p>
        </div>
        <div className="col-lg col-md col-sm-5 mx-1 mt-2 pe-1   col-12 shadow">
          <i className="fas fa-users-cog"></i>
          <h4>Other functionality</h4>
          <p>
            Manage employees' data and manage designation and departments and
            set manager for employees.
          </p>
        </div>
      </div>
    </>
  );
}

function About() {
  return (
    <>
      <div className="container" id="About">
        <h2 className="title-h2 ms-3 mb-4">About us</h2>
        <div className="row about">
          <div className="col-lg col-md col-12 text-center">
            <img
              width="75px"
              src="src/icons/title_logo.png"
              style={{ background: "#387cf7", borderRadius: "50%" }}
            />
            <h5>Jon Doe</h5>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, at
              dolorum aspernatur excepturi, sed rerum, optio soluta repellendus
              ratione iusto maxime possimus laudantium nisi! Corrupti illo
              voluptates vero fugit nam.
            </p>
          </div>
          <div className="col-lg col-md col-12 text-center">
            <img
              width="75px"
              src="src/icons/title_logo.png"
              style={{ background: "#387cf7", borderRadius: "50%" }}
            />
            <h5>Jon Doe</h5>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, at
              dolorum aspernatur excepturi, sed rerum, optio soluta repellendus
              ratione iusto maxime possimus laudantium nisi! Corrupti illo
              voluptates vero fugit nam.
            </p>
          </div>{" "}
          <div className="col-lg col-md col-12 text-center">
            <img
              width="75px"
              src="src/icons/title_logo.png"
              style={{ background: "#387cf7", borderRadius: "50%" }}
            />
            <h5>Jon Doe</h5>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, at
              dolorum aspernatur excepturi, sed rerum, optio soluta repellendus
              ratione iusto maxime possimus laudantium nisi! Corrupti illo
              voluptates vero fugit nam.
            </p>
          </div>
        </div>
      </div>
      <div>
        <div
          className="my-5"
          style={{ background: "#387cf7", color: "white", padding: "5px" }}
        >
          <div className="container my-5">
            <h1>Our Goals</h1>
            <p>
              Employees Management System is a web application for effectively
              managing employees. In companies handling employee data is the
              most important factor, so EMS provides functionalities like
              scheduling important meetings, events and managing employees'
              leave, salary, attendance, working hours with effective sorting
              and filtering techniques. This system provides a portal for
              employees to interact with the company and track their daily data
              like attendance, leave, salary, working hours. EMS frontend is
              built using Reactjs, which is a javascript library. EMS Backend
              provides an Application programming interface (API) that is built
              using Nodejs, Expressjs, MongoDB. When user requests for EMS
              frontend will load on the web browser window and API will provide
              data on user needs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Contact() {
  return (
    <>
      <div className="container">
        <h2 className="title-h2 ms-3 mb-4">Contact us</h2>
      </div>
      <div
        id="Contact"
        className="text-center text-lg-start"
        style={{ background: "#1d366d", color: "white" }}
      >
        <div
          className="
      d-flex
      justify-content-center justify-content-lg-between
      p-4
      border-bottom
    "
        >
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with us on social networks:</span>
          </div>
          <div>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-google"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="" className="me-4 text-reset">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
        <div className="">
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <a
                    className="navbar-brand fw-bold d-inline-flex align-items-center text-white"
                    href=""
                  >
                    <i className="fas fa-users"></i>
                    EMS
                  </a>
                </h6>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Quasi eveniet natus deleniti maxime, earum corporis possimus
                  quia commodi quibusdam fuga porro ducimus.
                </p>
              </div>
              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Products</h6>
                <p>
                  <a href="" className="text-reset">
                    EMS
                  </a>
                </p>
                <p>
                  <a href="" className="text-reset">
                    Bootstrap 5
                  </a>
                </p>
                <p>
                  <a href="" className="text-reset">
                    NodeJs
                  </a>
                </p>
                <p>
                  <a href="" className="text-reset">
                    ReactJs
                  </a>
                </p>
              </div>
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
                <p>
                  <a href="" className="text-reset">
                    Tour.
                  </a>
                </p>
                <p>
                  <a href="" className="text-reset">
                    Companies.
                  </a>
                </p>
                <p>
                  <a href="" className="text-reset">
                    About Us.
                  </a>
                </p>
                <p>
                  <a href="" className="text-reset">
                    Login/Register
                  </a>
                </p>
              </div>
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                <p>
                  <i className="fas fa-home me-3"></i> Vakanda , NDT 10012, US
                </p>
                <p>
                  <i className="fas fa-envelope me-3"></i>
                  info@vakanda.com
                </p>
                <p>
                  <i className="fas fa-phone me-3"></i> + 02 524 325 89
                </p>
                <p>
                  <i className="fas fa-print me-3"></i> + 01 585 578 20
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center p-4 d-flex align-items-center justify-content-center">
          © {new Date().getFullYear()} Copyright:
          <a
            className="navbar-brand ms-2 fw-bold d-inline-flex align-items-center text-white"
            href="#"
          >
            <i className="fas fa-users"></i>
            EMS
          </a>
        </div>
      </div>
    </>
  );
}

function Home() {
  return (
    <>
      <HomeNav />
      <HomeTitle />
      <Portals />
      <Services />
      <About />
      <Contact />
    </>
  );
}

export { Home };
