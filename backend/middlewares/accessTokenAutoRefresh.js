import refreshAccessToken from "../utils/refreshAccessToken.js";
import isTokenExpire from "../utils/isTokenExpired.js";  // ตรวจสอบว่าใช้งานฟังก์ชั่นนี้ถูกต้อง
import setTokensCookies from "../utils/setTokensCookies.js";  // ตรวจสอบการประกาศฟังก์ชั่นนี้

const accessTokenAutoRefresh = async (req, res, next) => {
    try {
        let accessToken = req.cookies?.access_token; // ใช้ let แทน const เพราะเราจะต้องมีการเปลี่ยนแปลงค่า

        // ถ้าไม่มีใน Cookies ลองดึงจาก Authorization header
        if (!accessToken && req.headers.authorization) {
            accessToken = req.headers.authorization.split(" ")[1]; // Bearer <token>
        }

        // เช็คว่า token มีค่าหรือไม่ และยังไม่หมดอายุ
        if (accessToken && !isTokenExpire(accessToken)) {
            req.headers['authorization'] = `Bearer ${accessToken}`;
        } else {
            // ถ้า access token หมดอายุ ลองใช้ refresh token เพื่อรีเฟรช access token
            const refreshToken = req.cookies?.refresh_token;
            if (!refreshToken) {
                throw new Error('Refresh token is missing');
            }

            // เรียกฟังก์ชั่น refreshAccessToken เพื่อนำมาใช้รีเฟรช access token
            const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res);

            // เซ็ตคุกกี้ใหม่ให้กับ user
            setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);

            // ตั้งค่า Authorization header ใหม่
            req.headers['authorization'] = `Bearer ${newAccessToken}`;
        }

        next();  // ให้ต่อไปยัง middleware ถัดไป
    } catch (error) {
        console.error('Error adding access token to header:', error.message);
        next(error);  // ส่ง error ไปยัง handler ถัดไป
    }
};

export default accessTokenAutoRefresh;
