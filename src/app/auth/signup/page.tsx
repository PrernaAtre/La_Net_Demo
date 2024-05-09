"use client";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/modules/auth/signup/hooks";
import { Logo } from "@/modules/home";
import { useFormik } from "formik";
import Link from "next/link";
import React from "react";
import { ToastContainer } from "react-toastify";

const SignUpForm: React.FC = () => {
  const { handleSubmit, initialValues, validationSchema } = useSignUp();

  const formik = useFormik({
    // @ts-ignore
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="">
          <Logo className="justify-center" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white text-neutral-800">
            Sign Up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={formik.handleSubmit}
            encType="multipart/form-data"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 dark:text-white text-neutral-600"
              >
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
                  className="block pl-2 w-full rounded-md border-0 py-1.5 dark:text-white text-neutral-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.username && formik.touched.username ? (
                  <p className="text-red-700 text-sm">
                    {formik.errors.username}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm  font-medium leading-6 dark:text-white text-neutral-600"
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
                  className="block w-full pl-2 rounded-md border-0 py-1.5 dark:text-white text-neutral-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  className="block w-full pl-2 rounded-md border-0 py-1.5 dark:text-white text-neutral-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.password && formik.touched.password ? (
                  <p className="text-red-700 text-sm">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 dark:text-white text-neutral-600"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full pl-2 rounded-md border-0 py-1.5 dark:text-white text-neutral-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.confirm_password &&
                formik.touched.confirm_password ? (
                  <p className="text-red-700 text-sm">
                    {formik.errors.confirm_password}
                  </p>
                ) : null}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 dark:text-white text-neutral-600"
                >
                  Select Profile
                </label>
                <input
                  id="profile_image"
                  name="profile_image"
                  type="file"
                  onChange={(event) => {
                    const files = event.currentTarget.files;

                    if (files && files.length > 0) {
                      const fileName = files?.[0];

                      formik.setFieldValue("profile_image", fileName);
                    } else {
                      // Handle case where no files are selected
                    }
                  }}
                  onBlur={formik.handleBlur}
                  className="block w-full pl-2 rounded-md border-0 py-1.5 dark:text-white text-neutral-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="fflex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 dark:text-white text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              variant="secondary"
              size="lg"
            >
              Sign Up
            </Button>
            <ToastContainer />
          </form>

          <div>
            <p>
              Already Registered?{" "}
              <Link href={"/auth/login"} className="underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
