// import React from 'react'
// import { useCurrentUser } from "@/modules/hooks";
// import { useCreateQuickNoteMutation } from '@/store/features/quickNote';

// export const useCreateQuickNote = () => {
//     const { user } = useCurrentUser();
//     console.log("user on create quick note-", user);

//     const [createQuickNote, {data, isLoading, error}] = useCreateQuickNoteMutation();
    
//     const handleCreateQuickNote = async (input: { name: string, document: string }, onComplete?: Function) => {
//         const { name, document } = input;
//          const createdPage = await createQuickNote({ name, document, userId: user._id });
  
//       if (onComplete) {   
//         onComplete(createdPage);
//       }
  
//       return createdPage
//     }
//   return {
//         quickNote : data,
//         isLoading,
//         error,
//         handleCreateQuickNote,
//   }
// }

import { useCurrentUser } from "@/modules/hooks";
import { setQuickNote } from "@/store/features/quickNote";
import { useEffect } from "react";
import { useCreateQuickNoteMutation } from "@/store/features/quickNote";
import { useDispatch, useSelector } from "react-redux";

export const useCreateQuickNote = () => {
    const { user } = useCurrentUser();
    const dispatch = useDispatch();
    const quickNote = useSelector((state : any) => state.quickNote.QuickNote);

    const [createQuickNote, { data, isLoading, error }] = useCreateQuickNoteMutation();

    useEffect(() => {
        if (!quickNote._id && user?._id) {
            // If quick note doesn't exist and user is logged in, check if quick note exists for the user
            // Perform any necessary API calls or checks here
            // For demonstration, assume we don't have an API and just set a dummy quick note
            dispatch(setQuickNote({
                _id: "1",
                userId: user._id,
                data : ""
            }));
        }
    }, [quickNote._id, user?._id, dispatch]);

    const handleCreateQuickNote = async (input: { data: string }, onComplete?: Function) => {
        const { data } = input;
        console.log("data---",data);
        const createdPage = await createQuickNote({ data, userId: user._id });
    
        if (onComplete) {
            onComplete(createdPage);
        }
    
        // Update the quick note slice with the newly created quick note
        dispatch(setQuickNote(createdPage));
    
        return createdPage;
    };

    return {
        quickNote,
        isLoading,
        error,
        handleCreateQuickNote,
    };
};
