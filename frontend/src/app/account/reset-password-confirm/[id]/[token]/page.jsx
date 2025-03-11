"use client";

import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/validation/schemas";
import { useResetPasswordMutation } from "@/lib/services/auth";
import { useState } from "react";

const initialValues = {
  password: "",
  password_confirmation: "",
};

const ResetPasswordConfirm = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id, token } = useParams();
  const [resetPassword] = useResetPasswordMutation(); // ✅ เรียกใช้ให้ถูกต้อง

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      setServerErrorMessage("");
      setServerSuccessMessage("");

      try {
        const response = await resetPassword({ id, token, ...values }).unwrap();
        setServerSuccessMessage(response?.message || "Password reset successful!");
        setTimeout(() => {
          router.push("/account/login"); // ✅ ส่งไปหน้า login หลัง reset สำเร็จ
        }, 2000);
      } catch (error) {
        setServerErrorMessage(error?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

        {serverSuccessMessage && (
          <div className="mb-4 text-green-600">{serverSuccessMessage}</div>
        )}
        {serverErrorMessage && (
          <div className="mb-4 text-red-500">{serverErrorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Enter your new password"
            />
            {errors.password && (
              <div className="text-sm text-red-500 px-2">{errors.password}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password_confirmation" className="block font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={values.password_confirmation}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Confirm your new password"
            />
            {errors.password_confirmation && (
              <div className="text-sm text-red-500 px-2">
                {errors.password_confirmation}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
