import AuthToken from "@/lib/AuthToken";
import { setCurrentUser, useSignUpMutation } from "@/store/features/auth";
import { map } from "lodash";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { signUpSchema } from "../schema/signUpSchema";

export const useSignUp = () => {

  const dispatch = useDispatch();
  const router = useRouter();

  const [signUp, { isLoading, error }] = useSignUpMutation({});

  const handleSubmit = async (input: Record<string, string>) => {
    try {
      const sanitizeInput = signUpSchema.cast(input, {
        assert: false,
        stripUnknown: false,
      });

      const formData = new FormData();

      map(sanitizeInput, (value: string | File, key: string) => formData.append(key, value))

      const response: any = await signUp(formData);

      if (response?.error) throw new Error(response?.error?.data);

      if (response?.data) {
        AuthToken.set(response?.data?.token);

        dispatch(setCurrentUser(response?.data?.user));

        toast.success("Sign up successful");

        router.push("/page");
      }
    } catch (error: any) {

      toast.error(error?.message);
    }
  };

  return {
    initialValues: signUpSchema.cast(
      {},
      { assert: false, stripUnknown: true }
    ),
    validationSchema: signUpSchema,
    isLoading,
    error,
    handleSubmit,
  };
};
