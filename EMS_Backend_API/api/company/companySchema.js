const { Schema, model } = require("mongoose");
const validator = require("validator");

const companyRegistationSchema = new Schema({
  name: {
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
    minlength: [40, "minimum 40 character require"],
    maxlength: [500, "maximum 500 character require"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Required"],
    trim: true,
  },
  aboutcompany: {
    type: String,
    required: [true, "Required"],
    minlength: [40, "minimum 40 character require"],
    maxlength: [500, "maximum 500 character require"],
    trim: true,
  },
  icon: {
    type: String,
    required: [true, "Required"],
    default: "http://localhost:3500/default/title_logo.png",
  },
  numberOfemployees: {
    type: Number,
    required: [true, "Required"],
    min: [0, "must be valid"],
  },
  links: {
    type: [{ platform: "", link: "" }],
  },
  createdAt: {
    type: String,
    default: new Date(),
  },
  updatedAt: {
    type: String,
    default: null,
  },
  registationVerification: {
    type: Boolean,
    required: [true, "Required"],
    enum: [true, false],
    default: false,
  },
  superadminVerification: {
    type: Boolean,
    required: [true, "Required"],
    enum: [true, false],
    default: false,
  },
  otptime: {
    type: Number,
    default: null,
  },
  otp: {
    type: Number,
    default: null,
  },
});

const companyregistations = model(
  "companyregistations",
  companyRegistationSchema
);

module.exports = { companyregistations };
