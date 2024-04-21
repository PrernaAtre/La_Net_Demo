import React from 'react'
import { string } from 'yup'

export interface signupFormDataType {
    username : string,
    email : string,
    password : string,
    confirm_password : string,
    profile_image :File | null,
}

export interface userDataType {
    username : string,
    email : string,
    password : string,
    confirm_password : string,
    profile_image : File|null,
}

export interface loginFormDataType {
    email : string,
    password : string,
}