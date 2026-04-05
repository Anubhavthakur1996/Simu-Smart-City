import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    polData: null,
    configData: {
      vType: "petrol",
      fType: "regular",
      speedCon: "normal",
      congestion: "none",
    },
    emissionData: null,
    policies: null,
    results: null,
  },
  reducers: {
    setPolData: (state, action) => {
      state.polData = action.payload;
    },
    setEmData: (state, action) => {
      state.emissionData = action.payload;
    },
    setPoliciesData: (state, action) => {
      state.policies = action.payload;
    },
    setResults: (state, action) => {
      state.results = { ...action.payload };
    },
  },
});

export const { setPolData, setEmData, setPoliciesData, setResults } =
  dataSlice.actions;
export default dataSlice;
