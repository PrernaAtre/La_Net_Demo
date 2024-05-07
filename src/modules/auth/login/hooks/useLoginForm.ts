import { setCurrentUser, useLoginMutation } from "@/store/features/auth";
import { loginSchema } from "../schema";
import AuthToken from "@/lib/AuthToken";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const [login, { isLoading, error }] = useLoginMutation({});

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

        router.push("/page");
      }

    } catch (error: any) {
      console.log(`[Login User] [Error]: ${error?.message}`);
    }
  };

  return {
    initialValues: loginSchema.cast({}, { assert: false, stripUnknown: false }),
    validationSchema: loginSchema,
    isLoading,
    error,
    handleSubmit,
  };
};
