import UserModel from "../models/User";
import { Stratrgy as Jwtstrtegy, ExtractJwt } from 'passport-jwt'
import passport from "passport";

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),secretOrkey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY

}

passport.use(new Jwtstrtegy(opts, function (jwt_payload, done){
    UserModel.findOne({_id: jwt_payload._id}, '-passowrd', 
    function(err, user){
        if(err){
            return done(err, false)
        }
        if(user){
            return done()
        }
    })
}))
