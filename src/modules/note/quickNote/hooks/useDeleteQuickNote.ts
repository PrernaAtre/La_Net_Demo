import { useDeleteQuickNoteMutation } from '@/store/features/quickNote'
import React from 'react'

export const useDeleteQuickNote = () => {
    const [deleteQuickNote, { data, isLoading, error }] = useDeleteQuickNoteMutation();

    const handleQuickNoteDelete = async (id: string) => {
        if (!id) {
            return;
        }
        const deletedQuickNote = await deleteQuickNote(id);
        return deletedQuickNote;
    }
    return {
        data, 
        isLoading, 
        error,
        handleQuickNoteDelete,
    }
}
