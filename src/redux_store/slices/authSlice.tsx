import { createSlice } from "@reduxjs/toolkit";
import { boolean } from "yup";

interface authState 
{
    isAuthenticated : boolean;
    user : []
}

const initialState : authState = {
    isAuthenticated: false,
    user : []
}

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
    }
})

export const {login, logout} =  authSlice.actions;

export const isAuthenticated = (state: { auth : authState}) => state.auth.isAuthenticated;
export const user = (state: { auth : authState}) => state.auth.user;

export default authSlice.reducer;