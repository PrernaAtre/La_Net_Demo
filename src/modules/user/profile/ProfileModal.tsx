"use client";
import { useCurrentUser } from "@/modules/hooks";
import { useUpdateUser } from "@/modules/user/hooks";
import { Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { updateFormSchema } from "./schema/updateFormSchema";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useCurrentUser();

  const { handleUpdateUser, initialValues } = useUpdateUser();

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
    onSubmit: () => {
      console.log("formik.values", formik.values);
      handleUpdateUser({ id: user?.id, user: formik.values });
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Grid container direction="column" alignItems="center" spacing={0}>
        <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
          <Grid item>
            <label htmlFor="profile_image">
              <img
                className="w-[42%] h-24 rounded-full mb-4 cursor-pointer mx-auto"
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
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="email"
                  label="Email"
                  name="email"
                  variant="outlined"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="email"
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  label="Password"
                  variant="outlined"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  label="Confirm Password"
                  name="confirm_password"
                  variant="outlined"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  variant="ghost"
                  size="lg"
                  onClick={() => formik.handleSubmit()}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Modal>
  );
};

export default ProfileModal;
