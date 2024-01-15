import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import config from "./config";

const oAuthCreds = config.OAUTH;
console.log(oAuthCreds);
passport.use(new GoogleStrategy({
    clientID: oAuthCreds.GOOGLE_CLIENT_ID,
    clientSecret: oAuthCreds.GOOGLE_CLIENT_SECRET,
    callbackURL: oAuthCreds.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    done(null, profile);
}));


export default passport;