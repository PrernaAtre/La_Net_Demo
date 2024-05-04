import { useCreatePageMutation } from "@/store/features/page";
import { debounce } from "lodash";
import { useCurrentUser } from "./useCurrentUser";
import { useLazyCurrentUserPages } from "./useLazyPages";
import { toast } from "sonner";

export const useCreatePage = () => {
  const { user } = useCurrentUser()
  console.log("current user ----on useCreate page", user);

  const { handleFetchPages } = useLazyCurrentUserPages()

  const [createPage, { data, isLoading, error }] = useCreatePageMutation();

  const handleCreatePage = debounce(async (input: { name: string, document: string }, onComplete?: Function) => {
      const { name, document } = input;
       const createdPage = await createPage({ name, document, userId: user._id });
    //    toast.promise(createdPage, {
    //     loading: "Creating a new note...",
    //     success: "New note created!",
    //     error: "Failed to create a new note."
    // });
     //  const createdPage = await createPage({ ...input, userId: user._id });

    await handleFetchPages();

    if (onComplete) {   
      onComplete(createdPage);
    }

    return createdPage
  }, 200)

  return {
    page: data,
    isLoading,
    error,
    handleCreatePage,
  }
}