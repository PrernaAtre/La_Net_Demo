import {
  usePublishMutation,
  useUnpublishMutation,
} from "@/store/features/page";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const usePublishPage = () => {
  const currentPage = useSelector((state: any) => state.page.currentPage);

  const [publishPage, { isLoading, error }] = usePublishMutation();

  const [
    unpublishPage,
    { isLoading: unpublishPageIsLoading, error: unpublishPageError },
  ] = useUnpublishMutation();

  //TODO: Define types for input and query parameters
  const handlePublishPage = async (
    id: string,
    isPublished: boolean = false
  ) => {
    if (!id) return;

    try {
      if (isPublished) {
        await unpublishPage(id);
        toast.success("Page unpublished successfully");
      } else {
        await publishPage(id);
        toast.success("Page published successfully");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return {
    isLoading: isLoading || unpublishPageIsLoading,
    error: error || unpublishPageError,
    handlePublishPage,
    page: currentPage,
  };
};
