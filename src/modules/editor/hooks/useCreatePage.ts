import { useCurrentUser } from "@/modules/hooks";
import { useCreatePageMutation } from "@/store/features/page";
import { debounce } from "lodash";

export const useCreatePage = () => {
  const { user } = useCurrentUser();

  const [createPage, { data, isLoading, error }] = useCreatePageMutation();

  const handleCreatePage = debounce(
    async (
      input: { name: string; document: Array<any> },
      onComplete?: Function
    ) => {
      const { name, document } = input;
      const createdPage: any = await createPage({
        name,
        document,
        userId: user._id,
      });

      if (onComplete) {
        onComplete(createdPage);
      }

      return createdPage;
    },
    200
  );

  return {
    page: data,
    isLoading,
    error,
    handleCreatePage,
  };
};
