
import { setPages, useCreatePageMutation } from "@/store/features/page";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "./useCurrentUser";
import { useLazyCurrentUserPages } from "./useLazyPages";
import { getUser } from "@/redux_store/slices/authSlice";
import { useSelector } from "react-redux";

export const useCreatePage = () => {

  const authStore = useSelector((state) => state);

  const user = getUser(authStore);

  const dispatch = useDispatch();

  const { pages, handleFetchPages } = useLazyCurrentUserPages();

  const [createPage, { data, isLoading, error }] = useCreatePageMutation();

  const handleCreatePage = debounce(
    async (
      input: { name: string; document: string },
      onComplete?: Function
    ) => {
      const { name, document } = input;
      const createdPage: any = await createPage({
        name,
        document,
        userId: user._id,
      });

      //    toast.promise(createdPage, {
      //     loading: "Creating a new note...",
      //     success: "New note created!",
      //     error: "Failed to create a new note."
      // });

      if (createdPage?.data) dispatch(setPages([createdPage?.data, ...pages]));

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
