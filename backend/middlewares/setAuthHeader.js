import isTokenExpire from "../utils/isTokenExpired.js";

const setAuthHeader = (req, res, next) => {
    try {
        // ใช้ชื่อที่ตรงกับ key ใน cookies
        const accessToken = req.cookies?.access_token; // access_token แทน accessToken

        // ถ้าไม่มีใน Cookies ลองดึงจาก Authorization header
        if (!accessToken && req.headers.authorization) {
            accessToken = req.headers.authorization.split(" ")[1]; // Bearer <token>
        }

        // เช็กว่า token มีค่าหรือไม่ และยังไม่หมดอายุ
        if (accessToken || !isTokenExpire(accessToken)) {
            req.headers['authorization'] = `Bearer ${accessToken}`;
        } else {
            console.warn("No valid access token found");
        }


        next();
    } catch (error) {
        console.error('Error adding access token to header:', error.message);
        next();
    }

    
};

export default setAuthHeader;





















