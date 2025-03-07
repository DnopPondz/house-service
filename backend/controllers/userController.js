import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import genarateTokens from "../utils/genarateToken.js";
import setTokensCookies from "../utils/setTokensCookies.js";

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
      const { email, password } = req.body;
  
      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({
          status: "failed",
          message: "Email and password are required",
        });
      }
  
      // Find user by email
      const user = await UserModel.findOne({ email });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
      }
  
      // Check if the account is verified
      if (!user.is_verifiled) {
        return res.status(401).json({ status: "failed", message: "Your account is not verified" });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: "failed", message: "Invalid email or password" });
      }
  
      // Generate tokens
      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await genarateTokens(user);
  
      // Set cookies
      setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);
  
      // Send success response with token
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
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to login, please try again later",
      });
    }
  };
  

  // Get New Access Token OP Refesh Token

  // Change Password

  // Profile OR Logged in User

  // Send Password Reset Email

  // Reset Pasword

  //Logout
}

export default UserController;
