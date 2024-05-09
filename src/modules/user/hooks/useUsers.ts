import { useLazyUsersQuery } from "@/store/features/user";
import { debounce } from "lodash";

export const useUsers = () => {
  const [fetchUsers, { data, isLoading, isError }] = useLazyUsersQuery();

  const loadUserOptions = debounce(async (inputValue: string) => {
    console.log("inputValue", inputValue)

    const users = await fetchUsers({ name: inputValue });

    const userOptions = (users.data as any || []).map((d: any) => ({ value: d._id, label: d.username }));

    console.log("userOptions", userOptions)

    return userOptions
  }, 300)

  return {
    users: data || [],
    isLoading,
    isError,
    loadUserOptions
  };
}