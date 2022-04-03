const empRouter = require("express").Router();
const {
  empLogin,
  forgotPassword,
  updatePassword,
  selectEmp,
  selectCompany,
  selectEmpById,
  updatePicture,
  takeAttendance,
  addEvent,
  selectEvent,
  deleteEvent,
  addLeaveRequest,
  selectAttendance,
  getLeaveRecords,
  getSalaryDetails,
} = require("./empController");
const { verifyEmployeeToken } = require("../../common/verifyToken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/employee");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.decoded.result._id}`);
  },
});

const upload = multer({
  storage: storage,
});

empRouter.post("/emplogin", empLogin);
empRouter.post("/forgotpassword", forgotPassword);
empRouter.put("/updatepassword", verifyEmployeeToken, updatePassword);
empRouter.get("/selectemp", verifyEmployeeToken, selectEmp);
empRouter.get("/selectcompany", verifyEmployeeToken, selectCompany);
empRouter.get("/selectmanager", verifyEmployeeToken, selectEmpById);
empRouter.get("/takeattendance", verifyEmployeeToken, takeAttendance);
empRouter.put(
  "/updatepicture",
  verifyEmployeeToken,
  upload.single("file"),
  updatePicture
);
empRouter.post("/addevent", verifyEmployeeToken, addEvent);
empRouter.get("/selectevents", verifyEmployeeToken, selectEvent);
empRouter.delete("/deleteevent", verifyEmployeeToken, deleteEvent);
empRouter.post("/requestleave", verifyEmployeeToken, addLeaveRequest);
empRouter.get("/getattendancerecords", verifyEmployeeToken, selectAttendance);
empRouter.get("/selectleaverecords", verifyEmployeeToken, getLeaveRecords);
empRouter.post("/salarydetail", verifyEmployeeToken, getSalaryDetails);

module.exports = empRouter;
