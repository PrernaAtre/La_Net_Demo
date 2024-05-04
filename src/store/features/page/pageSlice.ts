import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
  name: "page",
  initialState: {
    pages: [],
    page: {}
  },
  reducers: {
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    }
  }
})

export const { setPages, setPage } = pageSlice.actions;

export default pageSlice.reducer;