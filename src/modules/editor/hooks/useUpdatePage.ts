import { useGetPageQuery, useUpdatePageMutation } from "@/store/features/page";
import { debounce } from "lodash";

export const useUpdatePage = (id?: string) => {
  const { data: page, isLoading: isPageLoading, error: isPageError } = useGetPageQuery(id!);

  const [updatePage, { data, isLoading, error }] = useUpdatePageMutation();

  const handleUpdatePage = debounce(
    async (input: Record<string, any>, onComplete?: Function) => {

      const updatedPage = await updatePage({
        ...input,
        id: page?._id,
      });

      if (onComplete) {
        onComplete(updatedPage);
      }

      return updatedPage;
    },
    300
  );

  return {
    page: page,
    updatedPage: data,
    isLoading,
    error,
    handleUpdatePage,
    isPageLoading,
    isPageError,
  };
};
