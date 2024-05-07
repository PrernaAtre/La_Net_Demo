import * as Yup from "yup";

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d[\]{}!@#$%&;:\-+=_()]{10,}$/;

export const passwordSchema = Yup.string()
  .ensure()
  .matches(
    passwordRegex,
    "Password should contain at least one upper case, one small case, one number and minimum 10 characters."
  )
  .label("Password")
  .min(10, "Password should be of minimum 10 characters length.");

export const confirmPasswordSchema = Yup.string()
  .ensure()
  .label("Confirm Password")
  .oneOf(
    [Yup.ref("password")],
    "Password and Confirm Password does not match."
  );

export const signUpSchema = Yup.object({
  username: Yup.string()
    .required("Please enter username")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter email"),
  password: passwordSchema.required(),
  confirm_password: confirmPasswordSchema.required(),
  profile_image: Yup.mixed()
    .required("Select your profile image")
    .test("fileFormat", "Image only", (value) => {
      if (!value) return true;
      const file = value as File;
      return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
    }),
});
