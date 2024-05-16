import { useCurrentUser } from "@/modules/hooks";
import { useLazyGetCurrentUserQuery } from "@/store/features/user";
import { useSelector } from "react-redux";

export const useGetCurrentUser = () => {
  const { user } = useCurrentUser();
  const [refetch, { data, isLoading, isError }] = useLazyGetCurrentUserQuery({});

  const fetchUser = async () => {
    try {
      await refetch({});
    } catch (e) {
      console.log("Error while fetching current user", e);
    }
  }

  return {
    user: user,
    isLoading,
    isError,
    fetchUser
  };
}