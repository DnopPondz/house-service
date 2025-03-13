import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, // ✅ ใช้ .env แทน localhost
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    verifyEmail: builder.mutation({
      query: (user) => ({
        url: "/verify-email",
        method: "POST",
        body: user,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/login",
        method: "POST",
        body: user,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        body: {},
      }),
    }),
    resetPasswordLink: builder.mutation({
      query: (user) => ({
        url: "/reset-password-link",
        method: "POST",
        body: user,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ id, token, ...values }) => ({
        url: `/reset-password/${id}/${token}`,
        method: "POST",
        body: values,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    changePassword: builder.mutation({
      query: (actualData) => ({
        url: "/change-password",
        method: "POST",
        body: actualData,
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const { 
  useRegisterUserMutation, 
  useVerifyEmailMutation, 
  useLoginUserMutation, 
  useGetUserQuery, 
  useLogoutUserMutation,
  useResetPasswordLinkMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
