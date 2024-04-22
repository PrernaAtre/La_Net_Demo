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
  deletedDocuments: Note[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  note : [],
  deletedDocuments: [],
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
  

  
export const fetchDeletedDocuments = createAsyncThunk(
  'notes/fetchDeletedDocuments',
  async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/document/fetchDeletedDocuments/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching deleted documents');
    }
  }
);

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
      .addCase(fetchNoteById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.note = action.payload;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An error occurred.';
      })
      .addCase(fetchDeletedDocuments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeletedDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deletedDocuments = action.payload;
      })
      .addCase(fetchDeletedDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'An error occurred.';
      });
  },
});

export const selectAllNotes = (state: RootState) => state.notes.notes;
export const selectNoteById = (state: RootState, noteId: string) =>
  state.notes.notes.find((note) => note.id === noteId);
export const selectAllDeletedDocuments = (state: RootState) => state.notes.deletedDocuments;
export const singleNote = (state : RootState)  => state.notes.note;

export default notesSlice.reducer;
