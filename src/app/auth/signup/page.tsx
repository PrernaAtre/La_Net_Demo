"use client";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/modules/auth/signup/hooks";
import { useFormik } from "formik";
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
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
                className="block text-sm font-medium leading-6 text-white"
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
                  className="block pl-2 w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.username && formik.touched.username ? (
                  <p className="text-red-700">{formik.errors.username}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm  font-medium leading-6 text-white"
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
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.email && formik.touched.email ? (
                  <p className="text-red-700">{formik.errors.email}</p>
                ) : null}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
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
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.password && formik.touched.password ? (
                  <p className="text-red-700">{formik.errors.password}</p>
                ) : null}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
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
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.confirm_password &&
                formik.touched.confirm_password ? (
                  <p className="text-red-700">
                    {formik.errors.confirm_password}
                  </p>
                ) : null}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
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
                      console.log("data---", files);

                      const fileName = files?.[0];
                      console.log("fileName", fileName);

                      formik.setFieldValue(
                        "profile_image",
                        JSON.stringify(fileName)
                      );
                    } else {
                      // Handle case where no files are selected
                    }
                  }}
                  onBlur={formik.handleBlur}
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              variant="ghost"
              size="lg"
            >
              Sign Up
            </Button>
            <ToastContainer />
          </form>

          <p className="mt-10 text-center text-sm text-white">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
