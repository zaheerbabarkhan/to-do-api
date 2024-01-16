import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import config from "./config";
import { User } from "../database/models";
import { AccountType } from "../types/user.types";
import status from "../constants/status";

const oAuthCreds = config.OAUTH;
passport.use(new GoogleStrategy({
    clientID: oAuthCreds.GOOGLE_CLIENT_ID,
    clientSecret: oAuthCreds.GOOGLE_CLIENT_SECRET,
    callbackURL: oAuthCreds.GOOGLE_CALLBACK_URL
}, async (_accessToken, _refreshToken, profile, done) => {
    if (profile.emails) {
        const email = profile.emails[0].value;
        const [user, created] = await User.findOrCreate({
            where: {
                email,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
            },
            defaults: {
                email,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                accountType: AccountType.SOCIAL,
                statusId: status.ACTIVE
            }
        });
        if (!created && (user.statusId === status.DELETED || user.statusId === status.PENDING)) {
            user.statusId = status.ACTIVE;
            await user.save();
        }
        done(null, user);
    } else {
        done(new Error("No email found"));
    }
    
}));


export default passport;