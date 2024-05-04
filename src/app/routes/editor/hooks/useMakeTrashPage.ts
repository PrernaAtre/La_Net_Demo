import { useMakeTrashMutation, useRecoverMutation } from "@/store/features/page";
import { useLazyCurrentUserPages } from "./useLazyPages";

export const useMakeTrashPage = () => {
  const { handleFetchPages } = useLazyCurrentUserPages();

  const [trashPage, { data, isLoading, error }] = useMakeTrashMutation();

  const [recoverPage, { data: recoverPageData, isLoading: recoverPageIsLoading, error: recoverPageError }] = useRecoverMutation();


  //TODO: Define types for input and query parameters
  const handleTrashPage = async (id: string, isTrashed: boolean = false) => {
    if (!id) return;

    let trashData;

    console.log("isTrashed", isTrashed);
    if (isTrashed) trashData = await recoverPage(id);
    trashData = trashPage(id);
    handleFetchPages();
    return trashData;
  }

  return {
    data,
    isLoading,
    error,
    handleTrashPage
  }
}