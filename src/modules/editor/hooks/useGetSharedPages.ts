import { useGetSharedPagesQuery } from "@/store/features/page";


export const useGetSharedPages = () => {
    const { data, error, isLoading } = useGetSharedPagesQuery("");

  const handleFetchPages = () => {
    return data;
  }

  return {
    error,
    isLoading,
    handleFetchPages,
  }
}