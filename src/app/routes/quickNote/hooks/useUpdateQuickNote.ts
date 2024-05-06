import React from 'react'
import { useQuickNote } from './useQuickNote'
import { useUpdateQuickNoteMutation } from '@/store/features/quickNote';

export const useUpdateQuickNote = (id: string) => {
    const { quickNote, isLoading: isPageLoading, error: isPageError } = useQuickNote(id);
    const [updateQuickNote, { data, isLoading, error }] = useUpdateQuickNoteMutation();

    const handleCreateQuickNote = async (input: Record<string, any>, onComplete?: Function) => {
        const updatedQuickNote = await updateQuickNote({ ...quickNote, ...input, id: quickNote?._id });

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
        handleCreateQuickNote,
        isPageLoading,
        isPageError
    }
}
