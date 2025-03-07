import jwt from "jsonwebtoken";
import UserRefreshTokenModel from "../models/UserRefreshToken.js";

// Function to generate access and refresh tokens
const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };

        // ✅ Check if the secret keys are present in the environment variables
        if (!process.env.JWT_ACCESS_TOKEN_SECRET_KEY || !process.env.JWT_REFRESH_TOKEN_SECRET_KEY) {
            throw new Error("Missing JWT secret keys in environment variables");
        }

        // ✅ Set expiration time for the Access Token (100 seconds from now)
        const accessTokenExp = Math.floor(Date.now() / 1000) + 100; // 100 seconds
        const accessToken = jwt.sign(
            { ...payload, exp: accessTokenExp },
            process.env.JWT_ACCESS_TOKEN_SECRET_KEY
        );

        // ✅ Set expiration time for the Refresh Token (5 days from now)
        const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // 5 days
        const refreshToken = jwt.sign(
            { ...payload, exp: refreshTokenExp },
            process.env.JWT_REFRESH_TOKEN_SECRET_KEY
        );

        // ✅ Check if an existing refresh token exists in the database and remove it
        const userRefreshToken = await UserRefreshTokenModel.findOne({ userId: user._id });
        if (userRefreshToken) await userRefreshToken.deleteOne();

        // ✅ Save the new refresh token in the database
        await new UserRefreshTokenModel({ userId: user._id, token: refreshToken }).save();

        // Return the generated tokens and their expiration times
        return { accessToken, refreshToken, accessTokenExp, refreshTokenExp };
    } catch (error) {
        console.error("Error generating tokens:", error);
        return null; // ✅ Prevent undefined return in case of an error
    }
};

export default generateTokens;
