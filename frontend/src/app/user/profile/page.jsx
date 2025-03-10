"use client";

const Profile = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
                <div className="mb-4">
                    <label className="block font-medium mb-2">Name: <span className="font-normal">Pete</span></label>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-2">Email: <span className="font-normal">dodolo.lovely@gmail.com</span></label>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-2">Role: <span className="font-normal">User</span></label>
                </div>
            </div>
        </div>
    );
}

export default Profile;
