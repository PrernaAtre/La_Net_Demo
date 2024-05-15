import React, { useEffect } from 'react'
import { useQuickNote } from './useQuickNote'
import { useGetQuickNoteQuery, useUpdateQuickNoteMutation } from '@/store/features/quickNote';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export const useUpdateQuickNote = () => {
    const { quickNote, isLoading: isPageLoading, error: isPageError } = useQuickNote();
    const [updateQuickNote, { data, isLoading, error }] = useUpdateQuickNoteMutation();
    const dispatch = useDispatch();
   // const quickNote = useSelector((state : any)=> state.quickNote.QuickNote)

    const { refetch: refetchQuickNote } = useGetQuickNoteQuery("");


    
    const handleUpdateQuickNote = async (input: Record<string, any>, onComplete?: Function) => {
        const updatedQuickNote = await updateQuickNote({ ...quickNote, ...input });

        if (onComplete) {
            onComplete(updatedQuickNote);   
            toast.success("Data save successfully");
        }
        refetchQuickNote();
        return updatedQuickNote;
    }

    return {
        quickNote: quickNote,
        updatedQuickNote: data,
        isLoading,
        error,
        handleUpdateQuickNote,
        isPageLoading,
        isPageError
    }
}
