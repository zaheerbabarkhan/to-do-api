import passport from "passport";
import {Strategy as GoogleStrategy, VerifyCallback} from "passport-google-oauth20";
import { Strategy as GitHubStrategy, Profile} from "passport-github2";
import config from "./config";
import OAuthsService from "../services/OAuths.service";

const oAuthCreds = config.OAUTH;
passport.use(new GoogleStrategy({
    clientID: oAuthCreds.GOOGLE_CLIENT_ID,
    clientSecret: oAuthCreds.GOOGLE_CLIENT_SECRET,
    callbackURL: oAuthCreds.GOOGLE_CALLBACK_URL
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const user = await OAuthsService.createUser(profile);
        done(null, user);
    } catch(error) {
        done(error as Error);
    }
    
}));

passport.use(new GitHubStrategy({
    clientID: oAuthCreds.GITHUB_CLIENT_ID,
    clientSecret: oAuthCreds.GITHUB_CLIENT_SECRET,
    callbackURL: oAuthCreds.GITHUB_CALLBACK_URL,
},async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
        const user = await OAuthsService.createUser(profile);
        done(null, user);
    } catch(error) {
        done(error as Error);
    }
}));

export default passport;