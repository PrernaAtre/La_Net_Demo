"use client"
import Link from 'next/link'
import React, { useContext } from 'react'
import { loginFormDataType } from '../schema_datatype';
import { loginFormSchema } from './loginFormSchema';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
// import { authenticate } from '@/app/api/user_api';
import { middleware } from '@/app/middleware';
import { Bounce, toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { authenticate } from '@/app/api/user_api';
import { useDispatch, useSelector } from 'react-redux';
// import { useAuth } from '../utils/authContext';
import { login } from '@/redux_store/slices/authSlice';
import { authenticate } from '@/Store/actions/setUser';
import apiService from './authapi_service';


// import { authenticate } from '@/Store/actions/setUser';


const LoginForm: React.FC = () => {
  // const { login } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch()
  // const { isLoggedIn, setIsLoggedIn } = useAuth();
  const formInitialValues: loginFormDataType = {
    email: "",
    password: ""
  };

  // const logindata = useSelector((state)=>state)
  // console.log(logindata)
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: loginFormSchema,
    onSubmit: (values) => {
      // console.log('hello')
      // console.log(values)
      // createUser(values}
      handleSubmit(values)

    }
  })

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  const handleSubmit = async (loginUser: loginFormDataType) => {
    console.log(loginUser);

    // const data = new FormData(loginUser);
    const email: string = loginUser.email?.toString() || "";
    // console.log("email : "+email);
    const password = loginUser.password?.toString() || "";

    // middleware();
    // const isAuthenticated =  await dispatch(authenticate({email,password}));
    const response = await apiService.post('http://localhost:3001/auth/login', JSON.stringify({ email, password }));

    if (response.status === 'ok') {
      // router.push("/");
      console.log("login successfull");
      // StateLogin.setuserid()
      // const parseRes = await response.json();
      const current_user = response.jwt.user;
      console.log("cur user : ",current_user.username)
      await toast.success('Login Successfull');


      // router.push("/");
 
      dispatch(login({ user: current_user }));
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.password && formik.touched.password ? (
                  <p className='text-red-700'>{formik.errors.password}</p>) : null}
              </div>
            </div>
            <div className="text-sm">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Link href={"/auth/signup"}>
                  Sign Up
                </Link>
              </button>
            </div>
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

export default LoginForm;