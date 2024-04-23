import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { boolean } from "yup";

interface authState 
{
    isAuthenticated : boolean;
    user : [];
    users : [];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';

}

const initialState : authState = {
    isAuthenticated: false,
    user : [],
    users : [],
    status: 'idle',
}

export const fetchUsers = createAsyncThunk('notes/users', async (user:string) => {
    console.log("user id : ",user);
  const response = await axios.get(`http://localhost:3001/auth/search?name=${user}`, );
  //console.log("users : ",response);
  return response.data;
});

const authSlice = createSlice({
    name:"auth",
    initialState ,
    reducers:{
       login : (state, action) =>
       {
            console.log('login reducer ',action.payload)
            state.isAuthenticated = true;
            state.user = action.payload;
       },
       logout: (state) => {
            state.isAuthenticated = false;
            state.user = [];
       }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchUsers.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.users = action.payload;
            console.log("action.payload : ",action.payload);
            console.log("state.notes : ",state.users);
          })
          .addCase(fetchUsers.rejected, (state, action) => {
            state.status = 'failed';
           state.error = action.error.message ?? 'An error occurred.';
          })
        }
})

export const {login, logout} =  authSlice.actions;

export const isAuthenticated = (state: { auth : authState}) => state.auth.isAuthenticated;
export const user = (state: { auth : authState}) => state.auth.user;
export const users = (state : {auth : authState}) => state.auth.users;

export default authSlice.reducer;