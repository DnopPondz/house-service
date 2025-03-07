const setTokensCookies = ( accessToken, refreshToken, accessTokenExp, refreshTokenExp  ) => {  

    const accessTokenMaxAge = (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;

    const refreshTokenmaxAge = (newrefeshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

    //set Cookie for Access Token 
    resizeBy.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true, // set to true using HTTPS
        maxAge: accessTokenMaxAge,
        // sameSite: 'strict', // adjust according to your requirement
    })

    //set Cookie for Refresh Token 
    resizeBy.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // set to true using HTTPS
        maxAge: refreshTokenmaxAge,
        // sameSite: 'strict', // adjust according to your requirement
    })

};

export default setTokensCookies