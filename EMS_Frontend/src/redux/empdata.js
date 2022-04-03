import { createSlice } from "@reduxjs/toolkit";

export const empProfileSlice = createSlice({
  name: "empprofile",
  initialState: { value: {} },
  reducers: {
    storeEmpProfile: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const companyProfileSlice = createSlice({
  name: "companyprofile",
  initialState: { value: {} },
  reducers: {
    storeCompanyProfile: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const managerDetailSlice = createSlice({
  name: "managerdetail",
  initialState: { value: {} },
  reducers: {
    storeManagerDetail: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const empAttendanceSlice = createSlice({
  name: "empattendance",
  initialState: { value: { attendance: false } },
  reducers: {
    takeAttendance: (state, action) => {
      state.value = action.payload;
    },
  },
});

const empAttendanceReducer = empAttendanceSlice.reducer;
const { takeAttendance } = empAttendanceSlice.actions;

const empProfileReducer = empProfileSlice.reducer;
const { storeEmpProfile } = empProfileSlice.actions;

const companyProfileReducer = companyProfileSlice.reducer;
const { storeCompanyProfile } = companyProfileSlice.actions;

const managerDetailReducer = managerDetailSlice.reducer;
const { storeManagerDetail } = managerDetailSlice.actions;

export {
  empProfileReducer,
  storeEmpProfile,
  companyProfileReducer,
  storeCompanyProfile,
  managerDetailReducer,
  storeManagerDetail,
  empAttendanceReducer,
  takeAttendance,
};
