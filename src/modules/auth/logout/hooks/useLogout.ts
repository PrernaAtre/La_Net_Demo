import AuthToken from "@/lib/AuthToken";
import { removeCurrentUser } from "@/store/features/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useLogout = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const logout = async () => {

    AuthToken.remove();

    dispatch(removeCurrentUser())

    router.push("/");

    toast.success("Logout successful");
  };

  return {
    logout,
  };
};
