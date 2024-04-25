"use client"
import { useSelector } from "react-redux";
import Modal from "./userModal";
import { useEffect, useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import { updateFormSchema } from "./updateProfileSchema";
import axios from "axios";
import { useDispatch } from "react-redux";
import { update } from "@/redux_store/slices/authSlice";

interface UserProfile {
    username: string;
    email: string;
    password: string;
    confirm_password: string,
    profile_image: File | null,
}

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
    const user = useSelector((state) => state.auth.user.user);
    const dispatch = useDispatch();
    const [previewImage, setPreviewImage] = useState<string | null>(user?.profile_image || null);
    console.log("user-------", user);
    const formInitialValues: UserProfile = {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        profile_image: null,
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (files && files.length > 0) {
            const selectedImage = files[0];
            formik.setFieldValue("profile_image", selectedImage);
            setPreviewImage(URL.createObjectURL(selectedImage)); // Set preview image
        }
    };

    const formik = useFormik({
        initialValues: formInitialValues,
        validationSchema: updateFormSchema,
        onSubmit: (values) => {
            
            console.log("update values ------", values);
            const formData = new FormData();
            formData.append('username', values.username);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('confirm_password', values.confirm_password);
            formData.append('file', values.profile_image as File);
            // console.log("form data : ",formData);
            console.log([...formData.entries()]);
            try {
                updateUser(formData); // Pass the FormData object to createUser function
            } catch (error) {
                console.error("Error signing up:", error);
            }
        }
    });
    console.log(formik.errors)
    const updateUser = async(formData: any) => 
    {
        try{
            const res = await axios.put(`http://localhost:3001/auth/update/${user._id}`,formData);
            console.log("update res : ",res.data);
            const current_user = res.data;
            if(res.data)
            {
                dispatch(update({ user: current_user }));
                window.location.href = "/";
            }
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Grid container direction="column" alignItems="center" spacing={0}>
                <form encType="multipart/form-data">
                    <Grid item>
                        <label htmlFor="profile_image">
                            <img className="w-[42%] h-24 rounded-full mb-4 cursor-pointer mx-auto"
                               src={previewImage || user?.profile_image}
                                alt="Profile" />
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
                    <Grid item component="form">
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
                                <Button onClick={formik.handleSubmit} type="submit" variant="contained" color="primary">
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

export default UserProfileModal;
