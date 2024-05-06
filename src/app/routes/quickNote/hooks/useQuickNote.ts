import React from 'react'
import { useCurrentUser } from '../../editor/hooks/useCurrentUser';
import { useGetQuickNoteQuery } from '@/store/features/quickNote';

export const useQuickNote = (id? : string) => {
    const {data , error, isLoading} = useGetQuickNoteQuery(id || "");
    const { user } = useCurrentUser();
  return {
        quickNote : data,
        error,
        isLoading
  }
}
