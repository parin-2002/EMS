import { createSlice } from "@reduxjs/toolkit";

export const companyDesignationSlice = createSlice({
  name: "designation",
  initialState: { value: [] },
  reducers: {
    storeDesignation: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const companyDepartmentSlice = createSlice({
  name: "department",
  initialState: { value: [] },
  reducers: {
    storeDepartment: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const companyProfileDataSlice = createSlice({
  name: "companyprofiledata",
  initialState: { value: [] },
  reducers: {
    storeCompanyProfileData: (state, action) => {
      state.value = action.payload;
    },
  },
});

const companyProfileDataReducer = companyProfileDataSlice.reducer;
const { storeCompanyProfileData } = companyProfileDataSlice.actions;

const companyDesignationReducer = companyDesignationSlice.reducer;
const { storeDesignation } = companyDesignationSlice.actions;

const companyDepartmentReducer = companyDepartmentSlice.reducer;
const { storeDepartment } = companyDepartmentSlice.actions;

export {
  companyDesignationReducer,
  storeDesignation,
  companyDepartmentReducer,
  storeDepartment,
  companyProfileDataReducer,
  storeCompanyProfileData,
};
