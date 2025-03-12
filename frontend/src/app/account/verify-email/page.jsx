"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { verifyEmailSchema } from "@/validation/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyEmailMutation } from "@/lib/services/auth";

const initialValues = {
  email: "",
  otp: "",
};

const VerifyEmail = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [verifyEmail] = useVerifyEmailMutation();

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: verifyEmailSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerErrorMessage("");
      setServerSuccessMessage("");

      try {
        const response = await verifyEmail(values).unwrap();
        setServerSuccessMessage("Email verified successfully!");
        setTimeout(() => router.push("/account/login"), 2000);
      } catch (error) {
        setServerErrorMessage(error?.data?.message || "Verification failed.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Account</h2>
        <p className="text-sm text-center mb-6 text-gray-400">
          Check your email for OTP. OTP is valid for 15 minutes.
        </p>

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
              id="email"
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
            <label htmlFor="otp" className="block font-medium mb-2">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={values.otp}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-opacity-50 p-2"
              placeholder="Enter your OTP"
            />
            {errors.otp && touched.otp && (
              <div className="text-sm text-red-500 px-2">{errors.otp}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition duration-300 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-400 cursor-pointer"
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-sm text-gray-600 p-1 text-center">
          <Link
            href="/account/login"
            className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
