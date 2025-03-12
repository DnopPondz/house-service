import cookie from 'cookie';

// Function to set tokens as cookies
const setTokensCookies = (res, accessToken, refreshToken, accessTokenExp, refreshTokenExp) => {
    // Set the access token cookie
    res.setHeader('Set-Cookie', [
        cookie.serialize('access_token', accessToken, {
            httpOnly: true, // Make the cookie inaccessible to JavaScript (prevents XSS attacks)
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: accessTokenExp, // Set the expiration time of the access token cookie
            path: '/' // Set the path for which the cookie is valid
        }),

        // Set the refresh token cookie
        cookie.serialize('refresh_token', refreshToken, {
            httpOnly: true, // Make the cookie inaccessible to JavaScript (prevents XSS attacks)
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: refreshTokenExp, // Set the expiration time of the refresh token cookie
            path: '/' // Set the path for which the cookie is valid
        }),
        cookie.serialize('is_auth', true, {
            httpOnly: false, // Make the cookie inaccessible to JavaScript (prevents XSS attacks)
            secure: false, // Use secure cookies in production
            maxAge: refreshTokenExp, // Set the expiration time of the refresh token cookie
            path: '/' // Set the path for which the cookie is valid
        })
    ]);
};

export default setTokensCookies;
