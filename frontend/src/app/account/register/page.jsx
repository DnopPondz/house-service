"use client";

import { registerSchema } from "@/validation/schemas";
import { useFormik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { useRegisterUserMutation } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

const initialValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const Register = () => {
  const [createUser] = useRegisterUserMutation();
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        setServerErrorMessage("");
        setServerSuccessMessage("");

        console.log("📤 Sending values:", values);

        const response = await createUser(values).unwrap(); // ✅ ใช้ unwrap() เพื่อดึงข้อมูลโดยตรง

        console.log("✅ Response:", response);

        if (response?.status === "success") {
          setServerSuccessMessage(response.message);
          resetForm();
          router.push("/account/verify-email");
        } else {
          setServerErrorMessage(response?.message || "Unexpected error.");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        setServerErrorMessage(
          error?.data?.message || error?.error || "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {serverErrorMessage && (
          <div className="text-sm text-red-500 mb-4 text-center">
            {serverErrorMessage}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} // ✅ เพิ่ม onBlur ให้ทำงานถูกต้อง
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Enter your name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-sm text-red-500 px-2">{formik.errors.name}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-sm text-red-500 px-2">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-sm text-red-500 px-2">{formik.errors.password}</div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formik.values.password_confirmation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Confirm your password"
            />
            {formik.touched.password_confirmation &&
              formik.errors.password_confirmation && (
                <div className="text-sm text-red-500 px-2">
                  {formik.errors.password_confirmation}
                </div>
              )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-opacity-50 disabled:bg-gray-400 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-600 p-1">
          Already a user?
          <Link
            href="/account/login"
            className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out pl-1"
          >
            Login
          </Link>
        </p>

        {serverSuccessMessage && (
          <div className="text-sm text-green-500 px-2 text-center">
            {serverSuccessMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
