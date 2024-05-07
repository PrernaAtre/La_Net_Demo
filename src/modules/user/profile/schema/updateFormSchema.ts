import * as Yup from "yup";

export const updateFormSchema = Yup.object({
  id: Yup.string().required("Id is required"),
  username: Yup.string()
    .required("Please enter username")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter email"),
  password: Yup.string().required("Please enter password"),
  confirm_password: Yup.string()
    .required("Please enter confirm password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  profile_image: Yup.mixed()
    .required("Select your profile image")
    .test("fileFormat", "Image only", (value) => {
      if (!value) return true;
      const file = value as File;
      return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
    }),
});
