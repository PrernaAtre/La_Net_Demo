import { useCurrentUser } from "@/modules/hooks";
import { updateCurrentUser } from "@/store/features/auth";
import { useUpdateUserMutation } from "@/store/features/user";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export const useUpdateUser = () => {

  const dispatch = useDispatch();
  const rourter = useRouter();

  const { user } = useCurrentUser();

  const [updateUser, { error, isLoading }] = useUpdateUserMutation();

  const handleUpdateUser = async ({ id, user }: any) => {

    console.log("[Update User] [Input]:", user)

    const response: any = await updateUser({
      variables: {
        id: id,
        user: user,
      },
    });

    if (response?.data) {
      dispatch(updateCurrentUser(response?.data?.user));

      rourter.push("/page");
    }
  };

  const initialValues = {
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirm_password: "",
    profile_image: null,
  };

  return {
    handleUpdateUser,
    error,
    isLoading,
    initialValues,
  };
};
