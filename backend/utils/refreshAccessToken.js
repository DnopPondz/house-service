import UserRefreshTokenModel from "../models/UserRefreshToken.js";
import verifyRefrechToken from "./verifyRefreshToken.js";
import generateTokens from "./genarateToken.js";
import UserModel from "../models/User.js";



const refreshAccessToken = async (res, req) => {
    try {
      const oldRefreshToken = req.cookies.refresh_token; // ใช้ชื่อ refresh_token ตรงๆ
  
      // ตรวจสอบว่า refresh token ถูกต้องหรือไม่
      const { tokenDetail, error } = await verifyRefrechToken(oldRefreshToken);
  
      if (error) {
        return { error: true, message: "Invalid refresh token" };
      }
  
      // ค้นหาผู้ใช้จาก refresh token
      const user = await UserModel.findById(tokenDetail._id);
  
      if (!user) {
        return { error: true, message: "User not found" };
      }
  
      const userRefreshToken = await UserRefreshTokenModel.findOne({ userId: tokenDetail._id });
  
      if (oldRefreshToken !== userRefreshToken.token || userRefreshToken.blacklisted) {
        return { error: true, message: "Unauthorized access" };
      }
  
      // สร้าง access token และ refresh token ใหม่
      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user);
  
      // ส่งค่ากลับที่จำเป็น
      return {
        newAccessToken: accessToken,
        newRefreshToken: refreshToken,
        newAccessTokenExp: accessTokenExp,
        newRefreshTokenExp: refreshTokenExp
      };
    } catch (error) {
      console.error(error);
      return { error: true, message: "Internal server error" };
    }
  };
  



export default refreshAccessToken