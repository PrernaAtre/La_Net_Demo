import React, { useEffect } from 'react'
import { setQuickNote, useGetQuickNoteQuery } from '@/store/features/quickNote';
import { useCurrentUser } from "@/modules/hooks";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


export const useQuickNote = (id? : string) => {
  const dispatch = useDispatch();
    const {data , error, isLoading} = useGetQuickNoteQuery("");
    const quickNote = useSelector((state : any)=> state.quickNote.QuickNote)
    console.log("hhhhhhhhhhhh",quickNote?.data);
    const { user } = useCurrentUser();
    // useEffect(()=>{
    //   dispatch(setQuickNote(data))
    // },[data])
  return {
        quickNote : quickNote?.data,
        error,
        isLoading
  }
}
