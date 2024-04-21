"use client"
import React, { useContext } from 'react'

import { userDataType } from '../auth/schema_datatype'
import { cookies } from 'next/headers';
import axios from 'axios'
import { NextResponse, type NextRequest } from "next/server";
import { useRouter } from 'next/navigation';

//redux 
// import { useDispatch } from 'react-redux';
// import { setUser } from '@/Store/UserSlice';

// const StateLogin = useContext(LoginContext)
// console.log(StateLogin)

export const createUser = async (user : any) => {
    try {
        console.log("user------------ : ",user);
        const res = await axios.post("http://localhost:3001/auth/signup",user);
        console.log("res:" + res);
        const data = await res.data;
        console.log("data : " + data); // Handle the response data here
    } catch (error) {
        console.error("Error posting data:", error);
    }
}





