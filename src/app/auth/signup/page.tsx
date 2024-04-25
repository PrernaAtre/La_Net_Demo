"use client"
import { Button } from '@/components/ui/button'
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { signupFormSchema } from './signupFormSchema';
// import { createUser } from '@/app/api/user_api';
import { signupFormDataType } from '../schema_datatype';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';


const SignUpForm: React.FC = () => {

    const formInitialValues: signupFormDataType = {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        profile_image: null,
    };


    const formik = useFormik({
        initialValues: formInitialValues,
        validationSchema: signupFormSchema,
        onSubmit: (values) => {
           
            const formData = new FormData();
            
            formData.append('username', values.username);   
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('confirm_password', values.confirm_password);   
            formData.append('file', values.profile_image as File);
            
            // console.log("form data : ",formData);
            // console.log([...formData.entries()]);
            try {
                createUser(formData); // Pass the FormData object to createUser function
            } catch (error) {
                console.error("Error signing up:", error);
            }
        }
    }); 
    console.log(formik.errors);

  const createUser = async (user : any) => {
        try {
            console.log("user------------ : ",user);
            const res = await axios.post("http://localhost:3001/auth/signup",user);
            console.log("res:" + res);
            const data = await res.data;
            console.log("data : " + data); // Handle the response data here
            await toast.success('Register Successfull');
            window.location.href = "/auth/login";
            
        } catch (error) {
            console.error("Error posting data:", error);
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign Up to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={formik.handleSubmit} encType="multipart/form-data">

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    className="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {formik.errors.username && formik.touched.username ? (

                                    <p className='text-red-700'>{formik.errors.username}</p>) : null}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm  font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {formik.errors.email && formik.touched.email ? (

                                    <p className='text-red-700'>{formik.errors.email}</p>) : null}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {formik.errors.password && formik.touched.password ? (
                                    <p className='text-red-700'>{formik.errors.password}</p>) : null}
                            </div>

                            <div className="mt-2">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {formik.errors.confirm_password && formik.touched.confirm_password ? (
                                    <p className='text-red-700'>{formik.errors.confirm_password}</p>) : null}
                            </div>

                            <div className="mt-2">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Select Profile
                                </label>
                                <input
                                    id="profile_image"
                                    name="profile_image"
                                    type="file"
                                    onChange={(event) => {
                                        console.log("testtt---",event.target.files?.[0])
                                        const files = event.currentTarget.files;
                                        if (files && files.length > 0) {
                                            console.log("data---",files)
                                            const fileName = files?.[0];
                                            console.log(fileName)
                                            formik.setFieldValue('profile_image', event.currentTarget.files?.[0]);
                                        } else {
                                            // Handle case where no files are selected
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {/* {formik.errors.confirm_password && formik.touched.confirm_password ? (
                                    <p className='text-red-700'>{formik.errors.confirm_password}</p>) : null} */}
                            </div>
                        </div>

                        <Button type='submit' variant="ghost" size="sm">Sign Up</Button>
                        <ToastContainer />
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Start a 14 day free trial
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default SignUpForm;