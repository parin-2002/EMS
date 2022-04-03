import { createSlice } from "@reduxjs/toolkit";

export const companyAuthSlice = createSlice({
  name: "companyauth",
  initialState: { value: { auth: false } },
  reducers: {
    isAuthenticated: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const employeeAuthSlice = createSlice({
  name: "empauth",
  initialState: { value: { auth: false } },
  reducers: {
    isEmpAuthenticated: (state, action) => {
      state.value = action.payload;
    },
  },
});

const companyAuthReducer = companyAuthSlice.reducer;
const { isAuthenticated } = companyAuthSlice.actions;
const employeeAuthReducer = employeeAuthSlice.reducer;
const { isEmpAuthenticated } = employeeAuthSlice.actions;

export {
  companyAuthReducer,
  isAuthenticated,
  employeeAuthReducer,
  isEmpAuthenticated,
};
