import React from 'react'
import { useCurrentUser } from '../../editor/hooks/useCurrentUser'
import { useCreateQuickNoteMutation } from '@/store/features/quickNote';

export const useCreateQuickNote = () => {
    const { user } = useCurrentUser();
    console.log("user on create quick note-", user);

    const [createQuickNote, {data, isLoading, error}] = useCreateQuickNoteMutation();
    
    const handleCreateQuickNote = async (input: { name: string, document: string }, onComplete?: Function) => {
        const { name, document } = input;
         const createdPage = await createQuickNote({ name, document, userId: user._id });
  
      if (onComplete) {   
        onComplete(createdPage);
      }
  
      return createdPage
    }
  return {
        quickNote : data,
        isLoading,
        error,
        handleCreateQuickNote,
  }
}
