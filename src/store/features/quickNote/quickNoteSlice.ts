import { createSlice } from "@reduxjs/toolkit";

export interface QuickNote {
  _id: string;
  userId: string;
  data : string
}
const initialState: {
    QuickNote: QuickNote;
  } = {
    QuickNote: {
        _id: "",
        userId: "",
        data : ""
    },
};

export const quickNoteSlice = createSlice({
    name : "quickNote",
    initialState : initialState,
    reducers : {
        setQuickNote : (state,action) => {
            state.QuickNote = action.payload;
        },
    }
})

export const { setQuickNote } = quickNoteSlice.actions;
export const quickNote = (state:any) => state.quickNote.QuickNote;
export const quickNoteReducer = quickNoteSlice.reducer;
