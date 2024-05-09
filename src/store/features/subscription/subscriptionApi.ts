import { baseAPI } from "@/store/baseApi";

export const subscriptionApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: () => ({
        url: `payment`,
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          return data;
        } catch (error: any) {
          console.log("Error while checkout for premium plan.", error.message);
        }
      },
    }),
    manageSubscriptions: builder.query({
      query: () => ({
        url: `payment/manage`,
        method: "GET",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          return data;
        } catch (error: any) {
          console.log(
            "Error while trying to create subscription management session.",
            error.message
          );
        }
      },
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useLazyManageSubscriptionsQuery,
} = subscriptionApi;
