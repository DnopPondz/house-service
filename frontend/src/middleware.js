import { NextResponse } from "next/server";

const authPaths = ["/account/login", "/account/register"];
const publicPaths = ["/account/verify-email", "/account/reset-password-link"]; // ✅ เพิ่ม path reset password

export async function middleware(request) {
    try {
        const isAuthenticated = request.cookies.get("is_auth")?.value === "true";
        const path = request.nextUrl.pathname;

        // ✅ อนุญาตให้เข้าหน้า verify-email และ reset-password ได้โดยไม่มี middleware แทรกแซง
        if (publicPaths.includes(path)) {
            return NextResponse.next();
        }

        // ✅ ถ้าล็อกอินอยู่แล้ว และพยายามเข้าหน้า login/register → redirect ไปหน้า profile
        if (isAuthenticated && authPaths.includes(path)) {
            return NextResponse.redirect(new URL("/user/profile", request.url));
        }

        // ✅ ถ้ายังไม่ authenticate และกำลังเข้าถึงหน้า /user/:path* → redirect ไปหน้า login
        if (!isAuthenticated && !authPaths.includes(path)) {
            return NextResponse.redirect(new URL("/account/login", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error occurred while checking authentication:", error);
        return NextResponse.redirect(new URL("/error", request.url));
    }
}

// Matcher: ใช้ middleware กับหลายเส้นทางที่ต้องการ auth
export const config = {
    matcher: ["/user/:path*", '/account/login', '/account/register'],
};
