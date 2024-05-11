import React from 'react'
import { useQuickNote } from './useQuickNote'
import { useUpdateQuickNoteMutation } from '@/store/features/quickNote';

export const useUpdateQuickNote = () => {
    const { quickNote, isLoading: isPageLoading, error: isPageError } = useQuickNote();
    const [updateQuickNote, { data, isLoading, error }] = useUpdateQuickNoteMutation();

    const handleUpdateQuickNote = async (input: Record<string, any>, onComplete?: Function) => {
        const updatedQuickNote = await updateQuickNote({ ...quickNote, ...input });

        if (onComplete) {
            onComplete(updatedQuickNote);
        }
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
