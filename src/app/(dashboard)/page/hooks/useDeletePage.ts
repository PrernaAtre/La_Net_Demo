import { useDeletePageMutation, useMakeTrashMutation } from "@/store/features/page";
import { useLazyCurrentUserPages } from "./useLazyPages";

export const useDeletePage = () => {
  const { handleFetchPages } = useLazyCurrentUserPages();

  const [deletePage, { data, isLoading, error }] = useDeletePageMutation();

  //TODO: Define types for input and query parameters
  const handleDeletePage = async (id: string) => {
    if (!id) return;

    const deletedData = await deletePage(id);

    handleFetchPages();

    return deletedData;
  }

  return {
    data,
    isLoading,
    error,
    handleDeletePage
  }
}