import { useGetAllUsers } from "@/modules/user/hooks/useGetAllUsers";
import { debounce } from "lodash";
import { useMemo } from "react";
import { usePage } from "./usePage";
import { useSharePageMutation } from "@/store/features/page";
import { toast } from "sonner";

interface Option {
  label: string;
  value: string;
}

export const useSharePage = (id?: string) => {
  const { page, isLoading: isPageLoading, error: isPageError } = usePage(id!);

  const { users } = useGetAllUsers();

  const [sharePage, { data, isLoading, error }] = useSharePageMutation();

  const handleSharePage = debounce(
    async (userId: string, url: string, onComplete?: Function) => {
      try {
        if (!page?._id) throw new Error("Invalid input.");

        const updatedPage = await sharePage({
          id: page?._id,
          input: {
            userId,
            url,
          },
        });

        if (onComplete) {
          onComplete(updatedPage);
        }
        toast.success("page shared successfully");
        return updatedPage;
      } catch (error: any) {
        console.log(`[Share Page]: Error while sharing page: ${error.message}`);
      }
    },
    300
  );

  const defaultOptions = useMemo<Option[]>(() => {
    return (users || []).map((user: any) => ({
      value: user._id,
      label: `${user.username} (${user.email})`,
    }));
  }, [users]);

  const getUserOptions = (inputValue: string) => {
    if (!inputValue) return defaultOptions;

    return (defaultOptions || []).filter((user: any) =>
      user.label.includes(inputValue)
    );
  };

  const loadOptions = (inputValue: string) => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(getUserOptions(inputValue));
      }, 500);
    });
  };

  const initialValues = useMemo(
    () =>
      page?.sharedUsers?.length
        ? defaultOptions.filter((d) => page.sharedUsers.includes(d?.value))
        : [],
    [defaultOptions, page]
  );

  return {
    page: page,
    updatedPage: data,
    isLoading,
    error,
    handleSharePage,
    isPageLoading,
    isPageError,
    defaultOptions,
    loadOptions,
    initialValues,
  };
};
