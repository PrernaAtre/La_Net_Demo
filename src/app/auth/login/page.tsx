"use client";
import { useLogin } from "@/modules/auth/login/hooks";
import { Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import React from "react";
import { ForgotPasswordModal } from "../forgotPassword/ForgotPasswordModal";
import { Button } from "@/components/ui/button";

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
                {formik.errors.email && formik.touched.email && (
                  <p className="text-red-700">{formik.errors.email}</p>
                )}
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
                {formik.errors.password && formik.touched.password && (
                  <p className="text-red-700">{formik.errors.password}</p>
                )}
              </Grid>
              <Grid item xs={12}>
                <div className="text-sm">
                  <ForgotPasswordModal />
                </div>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="default"
                  className="w-[100%]"
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={12}>
                <p>
                  Not Registered? <Link href="/auth/signup">Sign Up</Link>
                </p>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
