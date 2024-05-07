import { baseAPI } from "@/store/baseApi";
import { updateCurrentUser } from "../auth";

export const authApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    users: builder.query({
      query: (payload: any) => ({
        url: `user/search`,
        method: "GET",
        body: payload,
      }),
      onQueryStarted: async (_payload, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          return data || [];
        } catch (e) {
          console.log("Error while fetching users", e);
        }
      },
    }),
    updateUser: builder.mutation({
      query: (payload: any) => ({
        url: `auth/update`,
        method: "POST",
        body: payload,
      }),
      onQueryStarted: async (_payload, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;

          if(data) dispatch(updateCurrentUser(data))

          return data;
        } catch (e) {
          console.log("Error while updating user", e);
        }
      },
    }),
  }),
});

export const { useUsersQuery, useUpdateUserMutation } = authApi;
