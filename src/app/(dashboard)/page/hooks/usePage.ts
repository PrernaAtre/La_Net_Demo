import { useLazyGetPageQuery } from "@/store/features/page";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const usePage = (id?: string) => {
  const page = useSelector((state: any) => state.page.pages.find((page: any) => page._id === id));

  const [fetchPage, { data, error, isLoading }] = useLazyGetPageQuery();

  useEffect(() => {
    if (!page && id) {
      fetchPage(id || "");
    }
  }, [id])

  return { page: page || data, error, isLoading }
}