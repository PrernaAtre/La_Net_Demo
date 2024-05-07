import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
});

export const {} = authSlice.actions;

export const userReducer = authSlice.reducer;
