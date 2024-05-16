import { baseAPI } from "@/store/baseApi";
import { setQuickNote } from "./quickNoteSlice";

export const quickNoteApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getQuickNote: builder.query({
      query: () => `quickNote`,
      onQueryStarted: async ({ dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("data---------",data);
          return data;
        } catch (e) {
          console.log("error while fetching page", e);
        }
      }
    }),


    updateQuickNote: builder.mutation({
      query: (payload: any) => ({
        url: `quickNote`,
        method: 'PUT',
        body: payload
      }),
      onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          return data;
        } catch (e) {
          console.log("error in updating page", e);
        }
      }
    }),
  })
})

export const {
  useGetQuickNoteQuery,
  useUpdateQuickNoteMutation,
} = quickNoteApi;
