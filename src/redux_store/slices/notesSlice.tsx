// notesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { string } from 'yup';

interface Note {
  userId : string,
  title: string;
  coverImageUrl: File | null;
  iconImage: string;
  description: string;
}

interface NotesState {
  notes: Note[];
  note : Note[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  note : [],
  status: 'idle',
  error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async (user:string) => {
    console.log("user id : ",user);
  const response = await axios.get(`http://localhost:3001/document/fetchDocuments/${user}`, );
  console.log("notes : ",response);
  return response.data;
});

export const fetchNoteById = createAsyncThunk('notes/fetchNoteById', async (documentId : number) => {
    try {
      const response = await axios.get(`http://localhost:3001/document/fetchDocument/${documentId}`);
    //  console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  });
  

// export const createNote = createAsyncThunk('notes/createNote', async (formdata : FormData, thunkAPI) => {
//   try {
//     // console.log("create  note try :", [...formdata.entries()]);
//     const response = await axios.post('http://localhost:3001/document/createDocument', formdata);
//     console.log("res : ",response);
//     return response.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response.data);
//   }
// });

// export const deleteDocument = createAsyncThunk('notes/deleteNote', async (documentId : number) => {
//   try {
//     const response = await axios.delete(`http://localhost:3001/document/deleteDocument/${documentId}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("error in deleting");
//   }
// });

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload;
        console.log("action.payload : ",action.payload);
        console.log("state.notes : ",state.notes);
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An error occurred.';
      })
      // .addCase(createNote.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(createNote.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.notes.push(action.payload);
      // })
      // .addCase(createNote.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message ?? 'An error occurred.';
      // })
      // .addCase(deleteDocument.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(deleteDocument.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.notes = state.notes.filter((note) => note.id !== action.payload);
      // })
      // .addCase(deleteDocument.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message ?? 'An error occurred.';
      // })
      .addCase(fetchNoteById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Since it's a single note, we'll replace the existing notes array with the fetched note
        // state.notes = [action.payload];
        state.note = action.payload;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An error occurred.';
      });
  },
});

export const selectAllNotes = (state: RootState) => state.notes.notes;
export const selectNoteById = (state: RootState, noteId: string) =>
  state.notes.notes.find((note) => note.id === noteId);

export const singleNote = (state : RootState)  => state.notes.note;

export default notesSlice.reducer;
