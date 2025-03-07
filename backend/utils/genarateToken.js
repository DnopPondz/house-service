import jwt from 'jsonwebtoken'
import UserRefreshTokenModel from '../models/UserRefreshToken.js';


const genarateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        //Genarate access token with expiration time 
        const accessTokenExp = Math.floor(Date.now() / 1000) + 100; //set expiration to 100 second from now

        const accessToken = jwt.sign(
            { ...payload, exp: accessTokenExp },
            process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
            // { expiresIn : '10' }
        );

        //Genarate refresh token expiration time 
        const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;//set sepiration to 5 days from now
        const refreshToken = jwt.sign(
            { ...payload, exp: refreshTokenExp },
            process.env.JWT_REFRESH_TOKEN_SECRET_KEY, //{ expiresIn: '5d' }
        )

        const userRefreshToken = UserRefreshTokenModel.findOne({ userId: user._id })
        if (userRefreshToken) await userRefreshToken.remove();

        //if want to blacklist rather then remove then use below code 
        // if (userRefreshToken) {
        //     userRefreshToken.blacklisted = true;
        //     await userRefreshToken.save()
        // }

        //save New refres Token 
        await new UserRefreshTokenModel({ userId: user._id, token: refreshToken }).save()

        return Promise.resolve({ accessToken, refreshToken, accessTokenExp, refreshTokenExp });

    } catch (error) {
        
    }
}

export default genarateTokens
