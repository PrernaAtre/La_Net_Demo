import { updateCurrentUser } from "@/store/features/auth";
import { useCreateSubscriptionMutation } from "@/store/features/subscription/subscriptionApi";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export const useCreateSubscription = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const [makeSubscription, { data, isLoading }] = useCreateSubscriptionMutation({});

  const handleClick = async () => {
    const response: any = await makeSubscription({});

    if (response.data) {
      dispatch(updateCurrentUser({ isSubscribed: true })); 
      router.push(response.data.url);
    }
  };

  return { data, isLoading, handleClick };
}