require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const companyRouter = require("./api/company/companyRouter");
const employeeRouter = require("./api/employee/manageEmp/employeeRouter");
const empRouter = require("./api/employee/emp/empRouter");
const { verifyCompanyToken } = require("./api/common/verifyToken");

//database connection for localhost
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});

// //database connection for cloud
// mongoose.connect(
//   "add your cloud database link of mongodb",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("database connection done"));
//

//allow cros platform
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static("uploads")); // load files
app.use(express.json()); //convert into json formet
app.use(cookieParser());
app.use("/api/company", companyRouter);
app.use("/api/company/manageemp", verifyCompanyToken, employeeRouter);
app.use("/api/emp", empRouter);

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome I am EMS data provider and all services are running well.</h1>"
  );
});

app.get("/checktoken", async (req, res) => {
  try {
    if (req.cookies.jwttoken) {
      jwt.verify(req.cookies.jwttoken, process.env.EMPKEY, (err, decode) => {
        if (err) {
          jwt.verify(
            req.cookies.jwttoken,
            process.env.COMPANYKEY,
            (err, decode) => {
              if (err) {
                throw new Error("unauthorized user");
              } else {
                return res
                  .status(200)
                  .json({ success: 1, accounttype: "company", status: true });
              }
            }
          );
        } else {
          return res
            .status(200)
            .json({ success: 1, accounttype: "employee", status: true });
        }
      });
    } else {
      throw new Error("unauthorized user");
    }
  } catch (err) {
    return res.status(400).json({
      success: 0,
      message: err.message,
    });
  }
});

app.get("/logout", (req, res) => {
  return res
    .cookie("jwttoken", "logout", {
      maxAge: 0,
      httpOnly: true,
      //secure:true
    })
    .send("logout");
});

app.listen(process.env.PORT || 4500, () => {
  console.log(`runningOn:  http://localhost:${process.env.PORT}`);
});
