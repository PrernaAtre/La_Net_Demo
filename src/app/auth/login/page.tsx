"use client";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/modules/auth/login/hooks";
import { Logo } from "@/modules/home";
import { useFormik } from "formik";
import Link from "next/link";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

const LoginForm: React.FC = () => {
  const { handleSubmit, initialValues, validationSchema } = useLogin();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center ite px-6 py-12 lg:px-8">
        <div className="ml-[49%]">
          <Logo />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:dark:text-white text-neutral-800">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 dark:text-white text-neutral-600"
              >
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
                  className="block w-full rounded-md border-0 p-1.5 dark:text-white text-neutral-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
                {formik.errors.email && formik.touched.email ? (
                  <p className="text-red-700 text-sm">{formik.errors.email}</p>
                ) : null}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 dark:text-white text-neutral-600"
                >
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
                  className="block w-full rounded-md border-0 p-1.5 dark:text-white text-neutral-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.password && formik.touched.password ? (
                  <p className="text-red-700 text-sm">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-semibold dark:text-white text-neutral-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
            <div>
              <Button
                type="submit"
                className="fflex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 dark:text-white text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                variant="secondary"
                size="lg"
              >
                Sign in
              </Button>
            </div>

            <div>
              <p>
                Not Registered?{" "}
                <Link href={"/auth/signup"} className="underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
