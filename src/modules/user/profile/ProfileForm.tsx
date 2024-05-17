"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/modules/hooks";
import { useUpdateUser } from "@/modules/user/hooks";
import { Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { updateFormSchema } from "./schema/updateFormSchema";
import { ReloadIcon } from "@radix-ui/react-icons";

interface ProfileFormProps {}

const ProfileForm: React.FC<ProfileFormProps> = ({}) => {
  const { user } = useCurrentUser();

  const { handleUpdateUser, initialValues, isLoading } = useUpdateUser();

  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profile_image || null
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files && files.length > 0) {
      const selectedImage = files[0];
      formik.setFieldValue("profile_image", selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage)); // Set preview image
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: updateFormSchema,
    onSubmit: handleUpdateUser,
  });

  return (
    <div className="w-80">
      <Grid
        container
        className="w-full"
        direction="column"
        alignItems="center"
        spacing={0}
      >
        <form
          encType="multipart/form-data"
          className="w-full"
          onSubmit={formik.handleSubmit}
        >
          <Grid item>
            <label htmlFor="profile_image">
              <img
                className="h-24 rounded-full mb-4 cursor-pointer mx-auto"
                src={previewImage || user?.profile_image}
                alt="Profile"
              />
            </label>
            <input
              id="profile_image"
              name="profile_image"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  label="Username"
                  variant="outlined"
                  name="username"
                  className="w-full"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isLoading ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </div>
  );
};

export default ProfileForm;
