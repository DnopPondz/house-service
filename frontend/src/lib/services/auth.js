import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/user",
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
        url: "/reset-password-link", // ✅ เพิ่ม `/` ให้ถูกต้อง
        method: "POST",
        body: user,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ id, token, ...values }) => ({
        url: `/reset-password/${id}/${token}`, // ✅ ใช้ id และ token ใน URL
        method: "POST",
        body: values, // ✅ ไม่ส่ง id และ token ใน body
        headers: { "Content-Type": "application/json" },
      }),
    }),
    changePassword: builder.mutation({
      query: (actualData) => ({
        url: "/change-password", // ✅ เพิ่ม `/` ให้ URL ถูกต้อง
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
  useResetPasswordLinkMutation, // ✅ Export ถูกต้อง
  useResetPasswordMutation, // ✅ Export ถูกต้อง
  useChangePasswordMutation, // ✅ เพิ่ม export changePassword
} = authApi;
