import { baseAPI } from "@/store/baseApi";

export const quickNoteApi = baseAPI.injectEndpoints({
    endpoints : (builder) => ({
        getQuickNote : builder.query({
            query : (id:string) => `quickNote/${id}`
        }),

        createQuickNote : builder.mutation({
            query: (payload: any) => ({
              url: `quickNote`,
              method: "POST",
              body: payload
            }),
            onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
              try {
                const { data } = await queryFulfilled;
                //TODO add data to the store
                return data;
              } catch (e) {
                console.log("error while creating page", e);
              }
            }
          }),

          updateQuickNote : builder.mutation({
            query : (payload : any) => ({
                url : `quickNote/${payload.id}`,
                method: 'PUT',
                body :  payload
            }),
            onQueryStarted : async (payload, {dispatch, queryFulfilled}) =>{
                try
                {
                    const {data} = await queryFulfilled;
                    return data;
                }
                catch(e)
                {
                    console.log("error in updating page", e);
                }
            }
          }),

          deleteQuickNote: builder.mutation({
            query: (id: string) => ({
              url: `quickNote/${id}`,
              method: "DELETE"
            })
          }),
    })
})

export const {useCreateQuickNoteMutation, useGetQuickNoteQuery, useUpdateQuickNoteMutation, useDeleteQuickNoteMutation} = quickNoteApi;
