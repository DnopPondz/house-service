import jwt from "jsonwebtoken";

const isTokenExpire = (token) => {
    if (!token) {
        return true; // ไม่มี token ถือว่าหมดอายุ
    }

    let decodedToken;
    try {
        decodedToken = jwt.decode(token);  // พยายาม decode token
    } catch (error) {
        console.error("Error decoding token:", error.message);
        return true; // ถ้า decode ไม่ได้ถือว่าหมดอายุ
    }

    if (!decodedToken || !decodedToken.exp) {
        console.warn("Token does not contain exp claim");
        return true; // ถ้า decode แล้วไม่มี `exp` ให้ถือว่าหมดอายุ
    }

    const currentTime = Date.now() / 1000;
    console.log("Decoded Token:", decodedToken); // แสดงข้อมูล token
    console.log("Current Time:", currentTime, "Token Expiry:", decodedToken.exp); // แสดงเวลา

    return decodedToken.exp < currentTime; // ตรวจสอบว่าหมดอายุหรือไม่
};

export default isTokenExpire;
