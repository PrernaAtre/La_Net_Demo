"use client"
import { Button } from "@mui/material"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useSelector } from "react-redux";
import Image from "next/image";
import empty from "../../../../public/empty.png";

interface EmptyDocumentProps {
    handleCreateNoteClick: () => void;
    trashWindowOpen: boolean;
}

export const EmptyDocument: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user.user);
    return (
        <>
            {/* <Image
                src="/empty.png"
                fill
                className="object-contain dark:hidden"
                alt="Documents"
            /> */}
            <span className="text-sm font-medium pl-4 text-black">Welcome to {user.username}'s Notion</span>
            <br />
            <Button
                className="mt-2 bg-black text-white !important"
                component="label"
                // onClick={handleCreateNoteClick}
                // disabled={trashWindowOpen}

                variant="contained"
                tabIndex={-1}
                startIcon={<AddCircleOutlineIcon />}
            > Create Note</Button>

        </>
    )
}