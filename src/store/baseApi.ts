import AuthToken from "@/lib/AuthToken"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseAPI = createApi({
  reducerPath: "",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    prepareHeaders: (headers) => {
      const token = AuthToken.get()
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({})
})