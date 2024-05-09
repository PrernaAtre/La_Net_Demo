import { createSlice } from "@reduxjs/toolkit";

export interface Page {
  _id: string;
  userId: string;
  name: string;
  document: any[];
  isTrashed: boolean;
  isPublish: boolean;
  createdAt: string;
  coverImage?: string;
}

const initialState: {
  pages: Page[];
} = {
  pages: [],
};

export const pageSlice = createSlice({
  name: "page",
  initialState: initialState,
  reducers: {
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    addPage: (state, action) => {
      state.pages = [action.payload, ...state.pages];
    },
    updatePage: (state, action) => {
      const { _id, ...patch } = action.payload;

      state.pages = state.pages.map((d) => {
        if (d._id === _id) {
          return {
            ...d,
            ...patch,
          };
        }
        return d;
      });
    },
    deletePage: (state, action) => {
      console.log("action.payload", action.payload);
      state.pages = state.pages.filter((d) => d._id !== action.payload._id);
    },
  },
});

export const getPagesByUserId = (state: any, userId: string) =>
  state.page.pages.filter((d: Page) => d.userId === userId);

export const { setPages, addPage, updatePage, deletePage } = pageSlice.actions;

export const pageReducer = pageSlice.reducer;
