import { setCurrentUser, useLoginMutation } from "@/store/features/auth";
import { loginSchema } from "../schema";
import AuthToken from "@/lib/AuthToken";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { useCurrentUser } from "@/modules/hooks";

export const useLogin = () => {
  const [login, { isLoading, error }] = useLoginMutation({});
  const { user } = useCurrentUser();
  const dispatch = useDispatch();

  const router = useRouter();

  const handleSubmit = async (input: Record<string, string>) => {
    try {
      const sanitizeInput = loginSchema.cast(input, {
        assert: false,
        stripUnknown: true,
      });

      const response: any = await login(sanitizeInput);

      if (response?.data) {
        AuthToken.set(response?.data?.token);

        dispatch(setCurrentUser(response?.data?.user));
        
        toast.success("Login successful");

        router.push("/page");
      }
      else {
        toast.error("Invalid username or passsword");
      }

    } catch (error: any) {

      toast.error("Login failed");

      console.log(`[Login User] [Error]: ${error?.message}`);
    }
  };
  
  useEffect(() => {
    if (user) {
      router.push("/page");
    }
  }, [user, router]);

  return {
    initialValues: loginSchema.cast({}, { assert: false, stripUnknown: false }),
    validationSchema: loginSchema,
    isLoading,
    error,
    handleSubmit,
  };
};
