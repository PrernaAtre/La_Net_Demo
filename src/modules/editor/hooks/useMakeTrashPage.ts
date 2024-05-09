import { useMakeTrashMutation, useRecoverMutation } from "@/store/features/page";
import { useLazyCurrentUserPages } from "./useLazyPages";
import { toast } from "sonner";

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
        toast.success("Page recovered successfully");
      } else {
        await trashPage(id);
        toast.success("Page trashed successfully");
      }

      await handleFetchPages();
    } catch (e: any) {
      console.log("error while trashing page", e);
      toast.error(e.message);
    }
  }

  return {
    data,
    isLoading,
    error,
    handleTrashPage
  }
}