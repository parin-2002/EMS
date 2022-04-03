const employeeRouter = require("express").Router();
const {
  addDesignation,
  selectDesignation,
  updateDesignation,
  deleteDesignation,
  addDepartment,
  selectDepartment,
  updateDepartment,
  deleteDepartment,
  addEmployee,
  selectEmployees,
  findEmp,
  updateEmp,
  takeAttendance,
  selectAttendance,
  changeManager,
  addEventType,
  deleteEventType,
  addEvent,
  deleteEvent,
  selectEventType,
  selectEvents,
  editEvent,
  getLeaveRequest,
  changeLeaveStatus,
  selectLeaveRecords,
  calculateTime,
  empOnLeaveToday,
  selectEmpByAttendance,
  getStatistic,
} = require("./employeeController");

//designation //done
employeeRouter.post("/adddesignation", addDesignation);
employeeRouter.get("/selectdesignation", selectDesignation);
employeeRouter.put("/updatedesignation", updateDesignation);
employeeRouter.delete("/deletedesignation", deleteDesignation); //pass data in url
//department ///done
employeeRouter.post("/adddepartment", addDepartment);
employeeRouter.get("/selectdepartment", selectDepartment);
employeeRouter.put("/updatedepartment", updateDepartment);
employeeRouter.delete("/deletedepartment", deleteDepartment); //pass data in url
// employee
employeeRouter.post("/addemployee", addEmployee);
employeeRouter.get("/selectemp", selectEmployees);
employeeRouter.post("/findemp", findEmp);
employeeRouter.put("/updateemp", updateEmp);
employeeRouter.put("/replacemanager", changeManager);
//attendance
employeeRouter.post("/takeattendance", takeAttendance);
employeeRouter.post("/selectattendance", selectAttendance);
//event
employeeRouter.post("/addeventtype", addEventType);
employeeRouter.get("/geteventtype", selectEventType);
employeeRouter.delete("/deleteeventtype", deleteEventType);
employeeRouter.post("/addevent", addEvent);
employeeRouter.get("/selectevents", selectEvents);
employeeRouter.put("/editevent", editEvent);
employeeRouter.delete("/deleteevent", deleteEvent);
employeeRouter.get("/getleaverequest", getLeaveRequest);
employeeRouter.post("/changeleavestatus", changeLeaveStatus);
employeeRouter.post("/filterleaves", selectLeaveRecords);
employeeRouter.post("/calculatetime", calculateTime);
employeeRouter.get("/onleaveemp", empOnLeaveToday);
employeeRouter.post("/filterempbyattendance", selectEmpByAttendance);
employeeRouter.get("/getStatistic", getStatistic);

module.exports = employeeRouter;
