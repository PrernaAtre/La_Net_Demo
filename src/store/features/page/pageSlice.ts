import { createSlice } from "@reduxjs/toolkit";

export interface Page {
  _id: string;
  userId: string;
  name: string;
  document: any[];
  isTrashed: boolean;
  publishId: string;
  createdAt: string;
  sharedUsers: string[]
  coverImage?: string;
}

const initialState: {
  pages: Page[];
  currentPage: Page | undefined;
} = {
  pages: [],
  currentPage: undefined,
};

export const pageSlice = createSlice({
  name: "page",
  initialState: initialState,
  reducers: {
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    addPage: (state, action) => {
      if (!state.currentPage) {
        state.currentPage = action.payload;
      }

      state.pages = [action.payload, ...state.pages];
    },
    updatePage: (state, action) => {
      if (!state.currentPage || state.currentPage?._id === action.payload._id) {
        state.currentPage = action.payload;
      }

      state.pages = state.pages.map((d) => {
        if (d._id === action.payload._id) {
          return action.payload;
        }

        return d;
      });
    },
    deletePage: (state, action) => {
      if (state.currentPage?._id === action.payload._id) {
        state.currentPage = undefined;
      }

      state.pages = state.pages.filter((d) => d._id !== action.payload._id);
    },
  },
});

export const getPagesByUserId = (state: any, userId: string) =>
  state.page.pages.filter((d: Page) => d.userId === userId);

export const { setPages, addPage, updatePage, deletePage } = pageSlice.actions;

export const pageReducer = pageSlice.reducer;
