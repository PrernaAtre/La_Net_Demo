import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const ForgotPasswordModal = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [email, setEmail] = useState();

    async function handleSubmit() {
        try {
            console.log("email=", email);
            const response = await axios.post("http://localhost:3001/auth/forgotPassword", { email })
            console.log("resssssss", response);
            const resMsg = response.data.message;
            console.log("resMsg", resMsg);
            // await toast(resMsg);
            toast.promise(
                Promise.resolve(resMsg), // Convert resMsg to a promise
                {
                    loading: 'Loading...',
                    success: (resMsg) => `${resMsg}`, // Display resMsg on success
                    error: 'Error',
                }
            );
            
        }
        catch (err) {

        }
    }

    return (
        <div>
            <Button onClick={handleOpen}>Forgot Password</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" className='mb-2' component="h2">
                        Forgot Password
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    variant="standard"
                                    onChange={(e) => {setEmail(e.target.value)}}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">Submit</Button>
                            </Grid>
                            <Toaster />
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}
