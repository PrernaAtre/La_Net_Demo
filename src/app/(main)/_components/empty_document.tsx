"use client"
import { Button } from "@mui/material"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useSelector } from "react-redux";
import Image from "next/image";
import empty from "../../../../public/empty.png";
import Link from "next/link";

interface EmptyDocumentProps {
    handleCreateNoteClick: () => void;
    trashWindowOpen: boolean;
}

export const EmptyDocument: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user.user);
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full mr-[50%]">
                <img
                    src="/empty.png"
                    className="dark:hidden"
                    alt="Documents"
                />
                <span className="text-sm font-medium pl-4 text-black">Welcome to {user.username}'s Notion</span>
                <br />
                <Button
                    className="mt-2 bg-black text-white !important"
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<AddCircleOutlineIcon />}
                > <Link href={`/routes/addpage`}>Create Note</Link></Button>
            </div>
        </>
    )
}