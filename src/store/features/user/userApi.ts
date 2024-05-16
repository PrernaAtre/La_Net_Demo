import { baseAPI } from "@/store/baseApi";
import { setCurrentUser, updateCurrentUser } from "../auth";

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
    getCurrentUser: builder.query({
      query: () => ({
        url: `user`,
        method: "GET",
      }),
      onQueryStarted: async (_payload, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;

          console.log("data", data)

          if (data) dispatch(setCurrentUser(data))

          return data || [];
        } catch (e) {
          console.log("Error while fetching current user", e);
        }
      },
    }),
  }),
});

export const { useUsersQuery, useUpdateUserMutation, useGetAllUsersQuery, useLazyUsersQuery, useGetCurrentUserQuery, useLazyGetCurrentUserQuery } = userApi;