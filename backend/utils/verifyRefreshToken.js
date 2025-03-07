import jwt from "jsonwebtoken"
import UserRefreshTokenModel from "../models/UserRefreshToken.js"

const verifyRefrechToken = async (refreshToken) => {
    try {
        const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

        // Find the refresh token document 
        const userRefreshToken = await UserRefreshTokenModel.findOne({ token: refreshToken })

        // If refesh token not found, reject with an error
        if (!userRefreshToken){
            throw { error: true, message: "Invalid refresh token" }
        }

        // Verify the refresh token 
        const tokenDetail = jwt.verify(refreshToken, privateKey);

        //If verification successfull, resolve with token datails
        return {
            tokenDetail,
            error: false,
            message: "Valid refresh token"
        }

    } catch (error) {
        // if any error occurs during varification or token not found, reject with an error
        throw { error: true, message: "Invalid refresh token" }
    }

}

export default verifyRefrechToken;