// import { createSlice } from "@reduxjs/toolkit";

// export interface CoverImage {
//   url?: string;
//   isOpen: boolean;
//   id?: string;
// }

// const initialState: CoverImage = {
//   url: undefined,
//   isOpen: false,
// };

// export const coverImageSlice = createSlice({
//   name: "coverImage",
//   initialState: initialState,
//   reducers: {
//     onOpen: (state) => {
//       state = { isOpen: true, url: undefined };
//     },
//     onClose: (state) => {
//       state = { isOpen: false, url: undefined };
//     },
//     onReplace: (state, action: { payload: { url: string } }) => {
//       state = { isOpen: true, url: action.payload.url };
//     },
//     setCoverImageId: (state, action: { payload: { id: string } }) => {
//       state = { ...state, id: action.payload.id };
//     },
//   },
// });

// export const { onOpen, onClose, onReplace, setCoverImageId } = coverImageSlice.actions;

// export const coverImageReducer = coverImageSlice.reducer;
