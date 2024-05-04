import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseAPI = createApi({
  reducerPath: "",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  endpoints: (builder) => ({})
})