import { useGetAllUsersQuery } from "@/store/features/user"

export const useGetAllUsers = () => {
  const { data, isLoading, isError } = useGetAllUsersQuery({});

  return {
    users: data,
    isLoading,
    isError
  }

}
