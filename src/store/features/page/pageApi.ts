import { baseAPI } from "@/store/baseApi";
import { addPage, deletePage, setCurrentPage, setPages, updatePage } from "./pageSlice";

export const pageApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPage: builder.query({
      query: (id: string) => `page/${id}`,
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCurrentPage(data));

          dispatch(updatePage(data))

          return data;
        } catch (e) {
          console.log("error while fetching page", e);
        }
      },
    }),
    createPage: builder.mutation({
      query: (payload: any) => ({
        url: `page`,
        method: "POST",
        body: payload,
      }),
      onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(addPage(data));
          }

          return data;
        } catch (e) {
          console.log("error while creating page", e);
        }
      },
    }),
    updatePage: builder.mutation({
      query: (payload: any) => ({
        url: `page/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(updatePage(data));
          }

          return data;
        } catch (e) {
          console.log("error while updating page", e);
        }
      },
    }),
    getPages: builder.query({
      query: (userId: string) => `page/user/${userId}`,
      onQueryStarted: async (userId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setPages(data));

          return data;
        } catch (e) {
          console.log("error while fetching pages", e);
        }
      },
    }),
    deletePage: builder.mutation({
      query: (id: string) => ({
        url: `page/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          //TODO add data to the store

          if (data?._id) {
            dispatch(deletePage(data?._id));
          }

          return data;
        } catch (e) {
          console.log("error while trashing page", e);
        }
      },
    }),
    makeTrash: builder.mutation({
      query: (id: string) => ({
        url: `page/trash/${id}`,
        method: "PUT",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(updatePage(data));
          }

          return data;
        } catch (e) {
          console.log("error while trashing page", e);
        }
      },
    }),
    recover: builder.mutation({
      query: (id: string) => ({
        url: `page/recover/${id}`,
        method: "PUT",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(updatePage(data));
          }

          return data;
        } catch (e) {
          console.log("error while recovering page", e);
        }
      },
    }),
    publish: builder.mutation({
      query: (id: string) => ({
        url: `page/publish/${id}`,
        method: "PUT",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data?.data) {
            dispatch(updatePage(data?.data));
          }

          return data;
        } catch (e) {
          console.log("Error while publishing page", e);
        }
      },
    }),
    unpublish: builder.mutation({
      query: (id: string) => ({
        url: `page/unpublish/${id}`,
        method: "PUT",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data?.data) {
            dispatch(updatePage(data?.data));
          }

          return data;
        } catch (e) {
          console.log("Error while unpublishing page", e);
        }
      },
    }),
    sharePage: builder.mutation({
      query: ({ id, input }: { id: string; input: { userId: string; url: string } }) => ({
        url: `page/shared-users/${id}`,
        method: "POST",
        body: input,
      }),
      onQueryStarted: async (_d, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
    
          if (data?.data) {
            dispatch(updatePage(data?.data));
          }
    
          return data;
        } catch (e) {
          console.log("Error while sharing the page", e);
        }
      },
    }),
    
  }),
});

export const {
  useCreatePageMutation,
  useGetPageQuery,
  useGetPagesQuery,
  useMakeTrashMutation,
  useDeletePageMutation,
  useRecoverMutation,
  useLazyGetPagesQuery,
  useUpdatePageMutation,
  useLazyGetPageQuery,
  usePublishMutation,
  useUnpublishMutation,
  useSharePageMutation
} = pageApi;
