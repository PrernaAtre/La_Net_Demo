import { baseAPI } from "@/store/baseApi";
import { updateCurrentUser } from "../auth";

export const userApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    users: builder.query({
      query: (payload: { name?: string }) => ({
        url: `user/search?name=${payload.name}`,
        method: "GET",
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
      query: (formData: any) => ({
        url: `user`,
        method: "PUT",
        body: formData,
      }),
      onQueryStarted: async (_payload, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;

          if (data) dispatch(updateCurrentUser(data))

          return data;
        } catch (e) {
          console.log("Error while updating user", e);
        }
      },
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: `user/fetchUsers`,
        method: "GET",
      }),
      onQueryStarted: async (_payload, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          return data || [];
        } catch (e) {
          console.log("Error while fetching all users", e);
        }
      },
    }),
  }),
});

export const { useUsersQuery, useUpdateUserMutation, useGetAllUsersQuery, useLazyUsersQuery } = userApi;
