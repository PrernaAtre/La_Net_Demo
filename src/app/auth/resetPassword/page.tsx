"use client"
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Grid, TextField, Button } from '@mui/material';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import axios from 'axios';

const resetPassword = () => {
    const searchParams = useSearchParams()
    const userId = searchParams.get('userId')
    const token = searchParams.get('token')
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`http://localhost:3001/auth/verifyToken/${userId}/${token}`);
                const resMsg = response.data.msg;
                if (response.status == 201) {
                    toast.promise(
                        Promise.resolve(resMsg), // Convert resMsg to a promise
                        {
                            loading: 'Loading...',
                            success: (resMsg) => `${resMsg}`, // Display resMsg on success
                            error: 'Error',
                        }
                    );
                    window.location.href = "/login";
                }
                else {
                    toast.error(resMsg);
                }
                console.log("Response:", response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [])

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (currentPassword !== confirmPassword) {
            toast.error("Current password and confirm password do not match");
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:3001/auth/resetPassword/${userId}`, { currentPassword, confirmPassword });;
            console.log("response--------", response);
            if (response.status == 201) {

            }
            else {

            }
        }
        catch (err) {

        }

    };

    console.log("token-----", token);
    console.log("useeeeeeee", userId);

    return (
        <>
            {/* <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="current_password"
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="confirm_password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Grid>
    </Grid> */}

            <Grid container className="h-screen fixed">
                <Grid item xs={6} className="flex justify-center">
                    <img src="/login.svg" alt="" className="w-full h-full object-cover" />
                </Grid>
                <Grid item xs={6} className="flex justify-center">
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="w-full max-w-md ml-[30%] mt-[57%]">
                            <p>Reset Password</p>
                        </div>

                        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="current_password"
                                        label="Current Password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="confirm_password"
                                        label="Confirm Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} className='ml-[10px]'>
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>

        </>
    )
}

export default resetPassword;