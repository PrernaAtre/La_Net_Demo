"use client";
import { useLazyGetPageQuery } from "@/store/features/page";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const usePage = (id?: string) => {
  const currentPage = useSelector((state: any) => state.page.currentPage);

  const [fetchPage, { error, isLoading }] = useLazyGetPageQuery();

  useEffect(() => {
    if (!currentPage || currentPage?._id !== id) {
      fetchPage(id || "")
    }
  }, [id, currentPage?._id]);

  return {
    page: currentPage,
    error,
    isLoading,
  };
};
