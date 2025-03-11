"use client";

import { useGetUserQuery } from "@/lib/services/auth"; 

const Profile = () => {
    const { data, isSuccess, isLoading, error } = useGetUserQuery();

    console.log("API Response:", data); // ✅ Debug API Response
    console.log("Error:", error); // ✅ Debug Error

    if (isLoading) return <p>Loading...</p>; 
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
                <div className="mb-4">
                    <label className="block font-medium mb-2">
                        Name: <span className="font-normal">{data?.user?.name || "N/A"}</span>
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-2">
                        Email: <span className="font-normal">{data?.user?.email || "N/A"}</span> 
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-2">
                        Verified: <span className="font-normal">{data?.user?.is_verifiled ? "Yes" : "No"}</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Profile;
