"use client";

import Link from "next/link";

const UserSidebar = () => {
  return (
    <div className="bg-purple-800 text-white h-screen p-4">
      <div className="mb-6">
        <Link href="/">
          <h2 className="text-lg font-bold text-center">Home</h2>
        </Link>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link
              href="/user/profile"
              className="hover:text-indigo-400 transition duration-300 ease-in-out"
            >
              Profile
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href=""
              className="hover:text-indigo-400 transition duration-300 ease-in-out"
            >
              Change Password
            </Link>
          </li>
          <li>
            <button className="hover:text-indigo-400 trasition duration-300 ease-in-out">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};


export default UserSidebar
