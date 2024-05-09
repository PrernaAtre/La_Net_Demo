import { baseAPI } from "@/store/baseApi";
import { updateCurrentUser } from "../auth";

export const subscriptionApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: () => ({
        url: `payment`,
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          console.log("data", data);

          // dispatch(updateCurrentUser(data));

          return data;
        } catch (e) {
          console.log("error while creating subscription", e);
        }
      },
    }),
  }),
});

export const { useCreateSubscriptionMutation } = subscriptionApi;