import { useLazyManageSubscriptionsQuery } from "@/store/features/subscription/subscriptionApi";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useManageSubscription = () => {
  const router = useRouter();

  const [manageSubscription, { isLoading, error }] =
    useLazyManageSubscriptionsQuery();

  const handleManageSubscription = debounce(async () => {
    const response = await manageSubscription({});

    if (response?.data?.url) {
      return router.push(response?.data?.url);
    }

    toast.error("Something went wrong while creating subscription session.");
  }, 500);

  return {
    handleManageSubscription,
    isLoading,
    error,
  };
};
