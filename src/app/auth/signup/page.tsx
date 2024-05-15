"use client"
import { Button, Grid, TextField } from "@mui/material";
import { useSignUp } from "@/modules/auth/signup/hooks";
import { useFormik } from "formik";
import Link from "next/link";
import React from "react";

const SignUpForm: React.FC = () => {
  const { handleSubmit, initialValues, validationSchema } = useSignUp();

  const formik = useFormik({
    // @ts-ignore
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Grid container className="min-h-screen">
      <Grid item xs={6} className="flex justify-center items-center">
        <div className="text-center">
          <img src="/login.svg" alt="" className="w-full h-full object-cover" />
        </div>
      </Grid>
      <Grid item xs={6} className="flex justify-center items-center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <TextField
              id="username"
              name="username"
              type="text"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              fullWidth
            />
            {formik.errors.username && formik.touched.username && (
              <p className="text-red-700">{formik.errors.username}</p>
            )}
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
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-700">{formik.errors.email}</p>
            )}
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
            {formik.errors.password && formik.touched.password && (
              <p className="text-red-700">{formik.errors.password}</p>
            )}
            <TextField
              id="confirm_password"
              name="confirm_password"
              type="password"
              label="Confirm Password"
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              fullWidth
            />
            {formik.errors.confirm_password && formik.touched.confirm_password && (
              <p className="text-red-700">{formik.errors.confirm_password}</p>
            )}
            <TextField
              id="profile_image"
              name="profile_image"
              type="file"
              onChange={(event) => {
                const files = (event.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  formik.setFieldValue("profile_image", files[0]);
                }
              }}
              onBlur={formik.handleBlur}
              fullWidth
            />
            {formik.errors.profile_image && formik.touched.profile_image && (
              <p className="text-red-700">{formik.errors.profile_image}</p>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-indigo-500 text-white font-semibold"
            >
              Sign Up
            </Button>

            <div>
              {formik.errors.non_field_errors && formik.touched.non_field_errors && (
                <p className="text-red-700">{formik.errors.non_field_errors}</p>
              )}
              <p>
                Already Registered?{" "}
                <Link href={"/auth/login"} className="underline">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignUpForm;
