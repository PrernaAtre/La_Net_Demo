"use client"
import Link from 'next/link';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import { loginFormDataType } from '../schema_datatype';
import { loginFormSchema } from './loginFormSchema';
import { useRouter } from 'next/navigation';
import { Bounce, toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '@/redux_store/slices/authSlice';
import apiService from './authapi_service';
import { Logo } from '@/app/(marketing)/_components/logo';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const formInitialValues: loginFormDataType = {
    email: '',
    password: ''
  };

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: loginFormSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    }
  });

  const handleSubmit = async (loginUser: loginFormDataType) => {
    console.log(loginUser);

    // const data = new FormData(loginUser);
    const email: string = loginUser.email?.toString() || "";
    // console.log("email : "+email);
    const password = loginUser.password?.toString() || "";

    // middleware();
    // const isAuthenticated =  await dispatch(authenticate({email,password}));
    const response = await apiService.post('http://localhost:3001/auth/login', JSON.stringify({ email, password }));
    console.log("res : ", response);
    if (response.jwt) {
      console.log("login successfull");
      const token = response.jwt.token;

      const current_user = response.jwt.user;
      console.log("cur user : ", current_user, token)
      await toast.success('Login Successfull');
      document.cookie = `token=${token}; path=/; expires=${new Date(
        (Date.now() + 365 * 24 * 60 * 1000)
      ).toUTCString()};`;
      dispatch(login({ user: current_user, token: token }));
      window.location.href = "/";
    }
    else {
      toast.error('Invalid User', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      // alert("Invalid user");
    }
  };

  return (
    <>
      <Grid container className="h-screen fixed">
        <Grid item xs={6} className="flex justify-center">
          <img src="/login.svg" alt="" className="w-full h-full object-cover" />
        </Grid>
        <Grid item xs={6} className="flex justify-center">
          <Grid item xs={12} sm={6} md={4}>
            <div className="w-full max-w-md ml-[40%] mt-[52%]">
             <p>Login</p>
            </div>

            <form className="space-y-6 mt-6" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="email"
                    required
                    fullWidth
                  />
                  {formik.errors.email && formik.touched.email && <p className="text-red-700">{formik.errors.email}</p>}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="current-password"
                    required
                    fullWidth
                  />
                  {formik.errors.password && formik.touched.password && <p className="text-red-700">{formik.errors.password}</p>}
                </Grid>
                <Grid item xs={12}>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-black hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    className="bg-black text-white font-semibold hover:bg-indigo-500"
                  >
                    Sign in
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <p>
                    Not Registered?{' '}
                    <Link href="/auth/signup">
                      Sign Up
                    </Link>
                  </p>
                </Grid>
              </Grid>
              <ToastContainer />
            </form>
          </Grid>
        </Grid>
        </Grid>
      </>
      );
};

      export default LoginForm;
