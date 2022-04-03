const { Schema, model } = require("mongoose");
const validator = require("validator");

const designationSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "companyregistations",
    required: [true, "Required"],
    trim: true,
  },
  designation: {
    type: String,
    required: [true, "Required"],
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Required"],
  },
});

const departmentSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "companyregistations",
    required: [true, "Required"],
    trim: true,
  },
  department: {
    type: String,
    required: [true, "Required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Required"],
  },
});

const employeeSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Required"],
    minlength: [5, "minimum 5 character require"],
    maxlength: [30, "maximum 30 character require"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("invalid email address");
      }
    },
  },
  mobileno: {
    type: String,
    required: [true, "Required"],
    trim: true,
    unique: true,
    min: [1, "not valid mobileno"],
    validate(val) {
      if (!validator.isMobilePhone(val)) {
        throw new Error("not valid mobileno");
      }
    },
  },
  address: {
    type: String,
    required: [true, "Required"],
    minlength: [30, "minimum 30 character require"],
    maxlength: [500, "maximum 500 character require"],
    trim: true,
  },
  profilepic: {
    type: String,
    required: [true, "Required"],
    default: "http://localhost:3500/default/profilepic.png",
  },
  designation: {
    type: Schema.Types.ObjectId,
    ref: "designations",
    required: [true, "Required"],
    trim: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "departments",
    required: [true, "Required"],
    trim: true,
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "employees",
    // required: [true, "Required"],
    trim: true,
  },
  workexperience: {
    type: Number,
    min: [0, "can't accept negetive value"],
    default: 0,
  },
  workexp_where: {
    type: String,
    default: "",
  },
  study_info: {
    type: String,
    required: [true, "Required"],
  },
  remark: {
    type: String,
    default: "",
  },
  otherDetail: {
    type: String,
    default: "",
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "companyregistations",
    required: [true, "Required"],
    trim: true,
  },
  createdAt: {
    type: String,
    default: new Date(),
  },
  updatedAt: {
    type: String,
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "companyregistations",
    trim: true,
    default: null,
  },
  joiningDate: {
    type: Date,
    required: [true, "Required"],
  },
  leavingDate: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    required: [true, "Required"],
    trim: true,
  },
  hoursperday: {
    type: Number,
    min: [0, "invalid value"],
    max: [24, "invalid input"],
    default: 0,
  },
  workdaysinweek: {
    type: Number,
    min: [0, "invalid value"],
    max: [7, "invalid input"],
    default: 0,
  },
  hourlysalary: {
    type: Number,
    min: [0, "invalid value"],
    default: 0,
  },
  currency: { type: String, default: "" },
  managerDesignation: {
    type: Schema.Types.ObjectId,
    ref: "designations",
    trim: true,
  },
  managerDepartment: {
    type: Schema.Types.ObjectId,
    ref: "departments",
    trim: true,
  },
  statusCmpAttendance: {
    type: Boolean,
    default: false,
  },
  statusEmpAttendance: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    trim: true,
    required: [true, "Required"],
    enum: ["male", "female", "other"],
  },
});

const attendanceSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "employees",
    trim: true,
    required: [true, "required"],
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "companyregistations",
    required: [true, "Required"],
    trim: true,
  },
  date: {
    type: Date,
    trim: true,
    required: [true, "required"],
  },
  statusEmp: {
    type: Boolean,
    default: false,
  },
  statusCmp: {
    type: Boolean,
    default: false,
  },
  shiftyTakenByEmployee: {
    type: [
      {
        startTime: Date,
        endTime: Date,
        totalMilliseconds: Number,
        totalSeconds: Number,
        totalMinutes: Number,
      },
    ],
  },
  shiftyTakenByCompany: {
    type: [
      {
        startTime: Date,
        endTime: Date,
        totalMilliseconds: Number,
        totalSeconds: Number,
        totalMinutes: Number,
      },
    ],
  },
});

const eventtypeSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "companyregistations",
    required: [true, "Required"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Required"],
    trim: true,
  },
  backgroundColor: {
    type: String,
    required: [true, "Required"],
    trim: true,
    lowercase: true,
  },
});

const eventSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "employees",
    trim: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "companyregistations",
    required: [true, "Required"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Required"],
    trim: true,
  },
  start: {
    type: Date,
    trim: true,
    required: [true, "required"],
  },
  end: {
    type: Date,
  },
  allDay: {
    type: Boolean,
    default: false,
    required: [true, "required"],
  },
  url: {
    type: String,
    trim: true,
    lowercase: true,
  },
  backgroundColor: {
    type: String,
    required: [true, "Required"],
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    required: [true, "Required"],
    enum: ["public", "private"],
    trim: true,
    lowercase: true,
  },
  isCompany: {
    type: Boolean,
    default: false,
    required: [true, "required"],
  },
  borderColor: {
    type: String,
    required: [true, "Required"],
    trim: true,
    lowercase: true,
  },
});

const leaveSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "employees",
    trim: true,
    required: [true, "Required"],
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "companyregistations",
    required: [true, "Required"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Required"],
    trim: true,
  },
  endDate: {
    type: Date,
    required: [true, "Required"],
    trim: true,
  },
  halfDay: {
    type: Number,
    min: [0, "not valid halfDay"],
    required: [true, "Required"],
  },
  fullDay: {
    type: Number,
    min: [0, "not valid fullDay"],
    required: [true, "Required"],
  },
  reason: {
    type: String,
    required: [true, "Required"],
    trim: true,
  },
  status: {
    type: String,
    trim: true,
    enum: ["approved", "cancelled", "pending"],
  },
});

const designations = model("designations", designationSchema);
const departments = model("departments", departmentSchema);
const employees = model("employees", employeeSchema);
const attendance = model("attendance", attendanceSchema);
const eventtypes = model("eventtypes", eventtypeSchema);
const events = model("events", eventSchema);
const leaves = model("leaves", leaveSchema);

module.exports = {
  designations,
  departments,
  employees,
  attendance,
  eventtypes,
  events,
  leaves,
};
