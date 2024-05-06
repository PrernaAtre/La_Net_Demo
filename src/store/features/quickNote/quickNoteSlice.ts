import { createSlice } from "@reduxjs/toolkit";

export const quickNoteSlice = createSlice({
    name: "quickNote",
    initialState: {
      quickNote : {}
    },
    reducers: {
      setQuickNote: (state, action) => {
        state.quickNote = action.payload;
      }
    }
  })
  
  export const { setQuickNote } = quickNoteSlice.actions;
  
  export default quickNoteSlice.reducer;