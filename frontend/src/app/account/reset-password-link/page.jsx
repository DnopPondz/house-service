"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { resetPasswordLinkSchema } from "@/validation/schemas";
const initialValues = {
  email: "",
};

const ResetPasswordLink = () => {
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: resetPasswordLinkSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  return (
    <div className="flex item-center justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
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
            {errors.email && (
              <div className="text-sm text-red-500 px-2">{errors.email}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600  transition duration-300 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled::bg-gray-400 cursor-pointer "
          >
            Send
          </button>
        </form>
        <p className="text-sm text-gray-600 p-1">
          Not a User?{" "}
          <Link
            href="/account/register"
            className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordLink;