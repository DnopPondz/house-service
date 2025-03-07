import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import setTokensCookies from "../utils/setTokensCookies.js";
import generateTokens from "../utils/genarateToken.js"
import refreshAccessToken from "../utils/refreshAccessToken.js";

class UserController {
  // User Registration
  static userRegistration = async (req, res) => {
    try {
      // Extract request body parameters
      const { name, email, password, password_confirmation } = req.body;

      // Check if all required fields are provided
      if (!name || !email || !password || !password_confirmation) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      // Check if password and password_confirmation match
      if (password !== password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "Password and Confirm Password don't match",
        });
      }

      // Check if email already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ status: "failed", message: "Email already exists" });
      }

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await new UserModel({
        name,
        email,
        password: hashedPassword,
      }).save();

      sendEmailVerificationOTP(newUser);

      // Send success response
      res.status(201).json({
        status: "success",
        message: "Registration Success",
        user: { id: newUser._id, email: newUser.email },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to Register, please try again later",
      });
    }
  };
  // User Email Verification
  static verifyEmail = async (req, res) => {
    try {
      // Extract request body parameters
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      const existingUser = await UserModel.findOne({ email });

      // Check if email doesn't exist
      if (!existingUser) {
        return res
          .status(404)
          .json({ status: "failed", message: "Email doesn't exist" });
      }

      // Check if email is already verified
      if (existingUser.is_verified) {
        return res
          .status(400)
          .json({ status: "failed", message: "Email is already verified" });
      }

      // Check if there is a matching email verification OTP
      const emailVerification = await EmailVerificationModel.findOne({
        userId: existingUser._id,
        otp,
      });
      if (!emailVerification) {
        if (!existingUser.is_verified) {
          await sendEmailVerificationOTP(existingUser); // Pass the existingUser here
          return res.status(400).json({
            status: "failed",
            message: "Invalid OTP, new OTP sent to your email",
          });
        }
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid OTP" });
      }

      // Ensure that emailVerification exists and createdAt is available
      if (!emailVerification.createdAT) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid OTP verification data" });
      }

      // Check if OTP is expired
      const currentTime = new Date();
      const expirationTime = new Date(
        emailVerification.createdAT.getTime() + 15 * 60 * 1000
      ); // Correct calculation for expiration time

      if (currentTime > expirationTime) {
        await sendEmailVerificationOTP(existingUser); // Pass the existingUser here
        return res.status(400).json({
          status: "failed",
          message: "OTP expired, new OTP sent to your email",
        });
      }

      // OTP is valid and not expired, mark email as verified
      existingUser.is_verifiled = true;
      await existingUser.save();

      // Delete email verification document
      await EmailVerificationModel.deleteMany({ userId: existingUser._id });

      return res
        .status(200)
        .json({ status: "success", message: "Email verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to verify email, please try again later",
      });
    }
  };

 // User login
 static userLogin = async (req, res) => {
  try {
      // ดึงข้อมูล user จากฐานข้อมูล
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
          return res.status(401).json({ status: "error", message: "Invalid credentials" });
      }

      // ✅ ตรวจสอบว่า generateTokens return ค่าอะไร
      const tokens = await generateTokens(user);
      console.log("Generated Tokens:", tokens);

      if (!tokens) {
          return res.status(500).json({ status: "error", message: "Failed to generate tokens" });
      }

      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = tokens;

      // ✅ ตั้งค่า Cookies
      setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);

      // ✅ ส่ง response กลับไป
      res.status(200).json({
          user: { id: user._id, email: user.email, name: user.name, roles: user.roles[0] },
          status: "success",
          message: "Login successful",
          access_token: accessToken,
          refresh_token: refreshToken,
          access_token_exp: accessTokenExp,
          is_auth: true,
      });
  } catch (error) {
      console.error("Error in userLogin:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

  // Get New Access Token OP Refesh Token
  static getNewAccessToken = async (req, res) => {
    try {
      // ตรวจสอบการเรียกใช้ refreshAccessToken
      const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(res, req);
  
      // หากไม่พบค่ากลับ ให้ส่งข้อความผิดพลาด
      if (!newAccessToken || !newRefreshToken) {
        return res.status(401).json({ status: "failed", message: "Unable to generate new token" });
      }
  
      // ตั้งค่า Cookies ใหม่
      setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);
  
      // ส่ง response กลับไป
      res.status(200).json({
        status: "success",
        message: "New token generated",
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        access_token_exp: newAccessTokenExp
      });
    } catch (error) {
      console.error(error);
      // ถ้ามีข้อผิดพลาดให้ส่งกลับเป็น 500
      res.status(500).json({ status: "failed", message: "Unable to generate new token, please try again later" });
    }
  };

  // Profile OR Logged in User
  static userProfile = async(req, res) => {
    res.send({ "user": req.user })
  }




  // Change Password

  // Send Password Reset Email

  // Reset Pasword

  //Logout
}

export default UserController;
