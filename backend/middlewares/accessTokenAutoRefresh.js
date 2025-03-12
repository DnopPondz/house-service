import refreshAccessToken from "../utils/refreshAccessToken.js";
import isTokenExpire from "../utils/isTokenExpired.js";  // ตรวจสอบว่าใช้งานฟังก์ชั่นนี้ถูกต้อง
import setTokensCookies from "../utils/setTokensCookies.js";  // ตรวจสอบการประกาศฟังก์ชั่นนี้
const accessTokenAutoRefresh = async (req, res, next) => {
    try {
        // ตรวจสอบว่า refresh_token มีใน cookies หรือไม่
        const accessToken = req.cookies?.access_token; // ค่าของ access_token จาก cookies
        const refreshToken = req.cookies?.refresh_token; // ค่าของ refresh_token จาก cookies

        // ถ้าไม่พบ refresh_token
        if (!refreshToken) {
            throw new Error('Refresh token is missing');
        }

        // ถ้าพบ access_token และมันไม่หมดอายุ
        if (accessToken && !isTokenExpire(accessToken)) {
            req.headers['authorization'] = `Bearer ${accessToken}`;
        }

        // รีเฟรช token ถ้ามันหมดอายุ
        if (accessToken && isTokenExpire(accessToken)) {
            const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res);
            setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);
            req.headers['authorization'] = `Bearer ${newAccessToken}`;
        }

        next();
    } catch (error) {
        console.error('Error adding access token to header:', error.message);
        res.status(401).json({ error: error.message });
    }
};


export default accessTokenAutoRefresh;
