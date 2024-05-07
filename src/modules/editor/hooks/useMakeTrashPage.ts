import { useMakeTrashMutation, useRecoverMutation } from "@/store/features/page";
import { useLazyCurrentUserPages } from "./useLazyPages";

export const useMakeTrashPage = () => {
  const { handleFetchPages } = useLazyCurrentUserPages();

  const [trashPage, { data, isLoading, error }] = useMakeTrashMutation();

  const [recoverPage, { data: recoverPageData, isLoading: recoverPageIsLoading, error: recoverPageError }] = useRecoverMutation();

  //TODO: Define types for input and query parameters
  const handleTrashPage = async (id: string, isTrashed: boolean = false) => {
    if (!id) return;

    try {
      if (isTrashed) {
        await recoverPage(id);
      } else {
        await trashPage(id);
      }

      await handleFetchPages();
    } catch (e) {
      console.log("error while trashing page", e);
    }
  }

  return {
    data,
    isLoading,
    error,
    handleTrashPage
  }
}