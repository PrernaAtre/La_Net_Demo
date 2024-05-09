import { useCurrentUser } from "@/modules/hooks";
import { updateCurrentUser } from "@/store/features/auth";
import { useUpdateUserMutation } from "@/store/features/user";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useUpdateUser = () => {

  const dispatch = useDispatch();

  const { user } = useCurrentUser();

  const [updateUser, { error, isLoading }] = useUpdateUserMutation();

  const handleUpdateUser = async (user: any) => {

    const formData = new FormData();

    formData.append("id", user.id);
    formData.append("username", user.username);
    formData.append("profile_image", user.profile_image as File);

    const response: any = await updateUser(formData);

    if (response?.data) {
      dispatch(updateCurrentUser(response?.data?.user));
      toast.success("User updated successfully");
    }
  };

  const initialValues = {
    id: user?._id || "",
    username: user?.username || "",
    profile_image: user?.profile_image || "",
  };

  return {
    handleUpdateUser,
    error,
    isLoading,
    initialValues,
  };
};
