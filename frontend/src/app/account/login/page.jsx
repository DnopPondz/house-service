"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { loginSchema } from "@/validation/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLoginUserMutation } from "@/lib/services/auth";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [loginUser] = useLoginUserMutation();

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerErrorMessage("");
      setServerSuccessMessage("");

      try {
        const response = await loginUser(values).unwrap();
        setServerSuccessMessage("Login successful! Redirecting...");
        
        setTimeout(() => {
          router.push("/user/profile");
        }, 2000);
      } catch (error) {
        setServerErrorMessage(error?.data?.message || "Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {serverSuccessMessage && (
          <div className="text-green-600 text-sm text-center mb-4">{serverSuccessMessage}</div>
        )}
        {serverErrorMessage && (
          <div className="text-red-500 text-sm text-center mb-4">{serverErrorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-opacity-50 p-2"
              placeholder="Enter your email"
            />
            {errors.email && touched.email && (
              <div className="text-sm text-red-500 px-2">{errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-opacity-50 p-2"
              placeholder="Enter your password"
            />
            {errors.password && touched.password && (
              <div className="text-sm text-red-500 px-2">{errors.password}</div>
            )}
          </div>

          <p className="text-sm text-gray-600 p-1 text-center">
            <Link
              href="/account/reset-password-link"
              className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
            >
              Forgot Password?
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition duration-300 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-400 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
