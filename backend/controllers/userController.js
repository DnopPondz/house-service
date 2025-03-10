import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import setTokensCookies from "../utils/setTokensCookies.js";
import generateTokens from "../utils/genarateToken.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import UserRefreshTokenModel from "../models/UserRefreshToken.js";
import transporter from "../config/emailConfig.js";
import jwt from "jsonwebtoken";

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
        return res
          .status(401)
          .json({ status: "error", message: "Invalid credentials" });
      }

      // ตรวจสอบรหัสผ่านว่าเป็นรหัสผ่านที่ถูกต้องหรือไม่
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid credentials" });
      }

      // ✅ ตรวจสอบว่า generateTokens return ค่าอะไร
      const tokens = await generateTokens(user);
      console.log("Generated Tokens:", tokens);

      if (!tokens) {
        return res
          .status(500)
          .json({ status: "error", message: "Failed to generate tokens" });
      }

      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
        tokens;

      // ✅ ตั้งค่า Cookies
      setTokensCookies(
        res,
        accessToken,
        refreshToken,
        accessTokenExp,
        refreshTokenExp
      );

      // ✅ ส่ง response กลับไป
      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles[0],
        },
        status: "success",
        message: "Login successful",
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_exp: accessTokenExp,
        is_auth: true,
      });
    } catch (error) {
      console.error("Error in userLogin:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  };

  // Get New Access Token OP Refesh Token
  static getNewAccessToken = async (req, res) => {
    try {
      // ตรวจสอบการเรียกใช้ refreshAccessToken
      const {
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp,
      } = await refreshAccessToken(res, req);

      // หากไม่พบค่ากลับ ให้ส่งข้อความผิดพลาด
      if (!newAccessToken || !newRefreshToken) {
        return res
          .status(401)
          .json({ status: "failed", message: "Unable to generate new token" });
      }

      // ตั้งค่า Cookies ใหม่
      setTokensCookies(
        res,
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp
      );

      // ส่ง response กลับไป
      res.status(200).json({
        status: "success",
        message: "New token generated",
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        access_token_exp: newAccessTokenExp,
      });
    } catch (error) {
      console.error(error);
      // ถ้ามีข้อผิดพลาดให้ส่งกลับเป็น 500
      res.status(500).json({
        status: "failed",
        message: "Unable to generate new token, please try again later",
      });
    }
  };

  // Profile OR Logged in User
  static userProfile = async (req, res) => {
    res.send({ user: req.user });
  };

  // Change Password
  static changeUserPassword = async (req, res) => {
    try {
      const { password, password_confirmation } = req.body;

      // Check if both password and password_confirmation are provided
      if (!password || !password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "New Password and Confirm New Password are required",
        });
      }

      // Check if password and password_confirmation match
      if (password !== password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "New Password and Confirm New Password don't match",
        });
      }

      // Password complexity check (e.g., at least 8 characters, 1 uppercase letter, 1 number)
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          status: "failed",
          message:
            "Password must be at least 8 characters long, contain at least one uppercase letter, and one number.",
        });
      }

      // Generate salt and hash the new password
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(password, salt);

      // Update user's password
      await UserModel.findByIdAndUpdate(req.user._id, {
        $set: { password: newHashedPassword },
      });

      res
        .status(200)
        .json({ status: "success", message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to change password, please try again later",
      });
    }
  };

  // Send Password Reset Link via Email
  static sendUserPasswordResetEmail = async (req, res) => {
    try {
      const { email } = req.body;

      // ตรวจสอบว่าได้กรอกอีเมลหรือไม่
      if (!email) {
        return res
          .status(400)
          .json({ status: "failed", message: "Email field is required" });
      }

      // ค้นหาผู้ใช้จากอีเมล
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "Email doesn't exist" });
      }

      // สร้าง token สำหรับการรีเซ็ตรหัสผ่าน
      const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });

      // สร้างลิงก์สำหรับรีเซ็ตรหัสผ่าน
      const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;

      // ส่งอีเมลสำหรับรีเซ็ตรหัสผ่าน
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `<p>Hello ${user.name},</p><p>Please <a href="${resetLink}">Click here</a> to reset your password.</p>`,
      });

      // ส่ง response กลับไป
      res.status(200).json({
        status: "success",
        message: "Password reset email sent. Please check your email.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to send password reset email. Please try again later.",
      });
    }
  };

  // Password Reset
  static userPasswordReset = async (req, res) => {
    try {
      const { password, password_confirmation } = req.body;
      const { id, token } = req.params;

      // Check if password and password_confirmation are provided
      if (!password || !password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "New Password and Confirm New Password are required",
        });
      }

      // Check if password and password_confirmation match
      if (password !== password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "New Password and Confirm New Password don't match",
        });
      }

      // Find user by ID
      const user = await UserModel.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }

      // Validate token
      const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
      jwt.verify(token, new_secret);

      // Check if password and password_confirmation are proided
      if (!password || !password_confirmation) {
        return res
          .status(400)
          .json({
            status: "failed",
            message: "New password and Confirm New Password are reqired",
          });
      }

      // Check if password and password_confirmation match
      if (password !== password_confirmation) {
        return res
          .status(400)
          .json({
            status: "failed",
            message: "New password and Confirm New Password don't match",
          });
      }

      // Generate salt and hash new password
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);

      // Update user's password
      await UserModel.findByIdAndUpdate(user._id, {
        $set: { password: newHashPassword },
      });

      // Send success response
      res
        .status(200)
        .json({ status: "success", message: "Password reset successfully" });

    } catch (error) {
      if (error.name === "TokenExpiredError"){
        return res.status(400).json({ status: "failed", message: "Token expired. Please request a new password reset link." })
      }
      return res.status(500).json({
        status: "failed",
        message: "Unable to reset password. Please try again later.",
      });
    }
  };

  //Logout
  static userLogout = async (req, res) => {
    try {
      // ดึง refreshToken จาก cookies (แก้ไขพิมพ์ผิด)
      const refreshToken = req.cookies?.refresh_token; 
  
      // ถ้ามี refreshToken ให้ blacklist ใน database
      if (refreshToken) {
        await UserRefreshTokenModel.findOneAndUpdate(
          { token: refreshToken },
          { $set: { blacklisted: true } },
          { new: true } // เพิ่ม option เพื่อให้ MongoDB คืนค่าใหม่กลับมา
        );
      }
  
      // Clear access token และ refresh token cookies
      res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "strict" });
      res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "strict" });
      res.clearCookie("is_auth", { httpOnly: true, secure: true, sameSite: "strict" });
  
      return res.status(200).json({ status: "success", message: "Logout Successful" });
    } catch (error) {
      console.error("Logout Error:", error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to logout, please try again later",
      });
    }
  };
  
}

export default UserController;
