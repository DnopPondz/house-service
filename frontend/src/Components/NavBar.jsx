"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import Cookies from "js-cookie";

const NavBar = () => {
  const [isAuth, setIsAuth] = useState(false); // ✅ เปลี่ยนจาก null → false (แก้ปัญหา Spinner ค้าง)

  useEffect(() => {
    const authCookies = Cookies.get("is_auth") === "true"; // ✅ แปลงค่าเป็น boolean
    setIsAuth(authCookies);
  }, []); // ✅ ใส่ [] ป้องกัน re-render loop

  return (
    <>
      {isAuth === null && <LoadingIndicator />} {/* ✅ Spinner จะไม่ค้างแล้ว */}
      <nav className="bg-purple-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-white mr-4">
              Home
            </Link>
            {isAuth ? (
              <Link href="/user/profile" className="text-white mr-4">
                Profile
              </Link>
            ) : (
              <>
                <Link href="/account/login" className="text-white mr-4">
                  Login
                </Link>
                <Link href="/account/register" className="text-white mr-4">
                  Registration
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
