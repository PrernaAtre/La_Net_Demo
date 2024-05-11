import React from 'react'
import { useGetQuickNoteQuery } from '@/store/features/quickNote';
import { useCurrentUser } from "@/modules/hooks";


export const useQuickNote = (id? : string) => {
    const {data , error, isLoading} = useGetQuickNoteQuery("");
    const { user } = useCurrentUser();
  return {
        quickNote : data,
        error,
        isLoading
  }
}
