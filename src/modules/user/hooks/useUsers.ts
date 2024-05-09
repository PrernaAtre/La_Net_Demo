import { useLazyUsersQuery } from "@/store/features/user";
import { debounce } from "lodash";

export const useUsers = () => {
  const [fetchUsers, { data, isLoading, isError }] = useLazyUsersQuery();

  const loadUserOptions = debounce(async (inputValue: string) => {
    const users = await fetchUsers({ name: inputValue });

    const userOptions = (users.data as any || []).map((d: any) => ({ value: d._id, label: d.username }));

    return userOptions
  }, 300)

  return {
    users: data || [],
    isLoading,
    isError,
    loadUserOptions
  };
}