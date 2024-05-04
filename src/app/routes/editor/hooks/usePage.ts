import { useGetPageQuery } from "@/store/features/page";

export const usePage = (id?: string) => {
  const { data, error, isLoading } = useGetPageQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true
  });

  return {
    page: data,
    error,
    isLoading
  }
}