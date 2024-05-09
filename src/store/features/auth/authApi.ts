import { baseAPI } from "@/store/baseApi";

export const authApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (formData: any) => ({
        url: `auth/signup`,
        method: "POST",
        body: formData,
      }),
      onQueryStarted: async (_payload, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          return data;
        } catch (e) {
          console.log("error while creating user", e);
        }
      },
    }),
    login: builder.mutation({
      query: (payload: any) => ({
        url: `auth/login`,
        method: "POST",
        body: payload,
      }),
      onQueryStarted: async (_payload, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          return data;
        } catch (e) {
          console.log("error while logging in", e);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation } = authApi;
