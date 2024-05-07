import { useLazyGetPageQuery } from "@/store/features/page";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

export const usePage = (id?: string) => {
  const pages = useSelector((state: any) => state.page.pages);

  const [fetchPage, { data, error, isLoading }] = useLazyGetPageQuery();

  const currentPage = useMemo(() => {
    return pages.find((page: any) => page._id === id)
  }, [pages])

  useEffect(() => {
    if (!currentPage && id) {
      fetchPage(id || "");
    }
  }, [id, currentPage])

  return {
    page: currentPage || data, error, isLoading
  }
}