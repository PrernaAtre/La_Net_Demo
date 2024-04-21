import { useState } from "react"
import NoteForm from "./note"
import {
    TextField,
    Box,
    CircularProgress,
    Typography,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
//   import { useLocation } from "react-router-dom";
//   import Center from "../components/utils/Center";
//   import { getPage } from "../api/getPage";
//   import { updateTitle, updateContent } from "../api/updatePage";
export const Navbar = () => {
    const [title, setTitle] = useState("hey");
    return (
        <>
            <NoteForm />
        </>

    )
}