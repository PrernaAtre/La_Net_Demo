import { useGetPagesQuery } from "@/store/features/page";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useSelector } from "react-redux";
import { debounce } from "lodash";

export const useCurrentUserPages = () => {
  const { user } = useCurrentUser();

  const currentUserPages = useSelector((state: any) => state.page.pages);

  const { error, isLoading, refetch } = useGetPagesQuery(user?._id, {
    skip: !user?._id
  });

  const handleRefetch = debounce(refetch, 500)

  return {
    pages: currentUserPages,
    error,
    isLoading,
    handleRefetch
  }
}