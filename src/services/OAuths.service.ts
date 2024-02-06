import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as GitHubProfile} from "passport-github2";
import JWT from "../utils/jwt.util";
import { AccountType } from "../types/user.types";
import { User } from "../database/models";
import status from "../constants/status";
import { Op } from "sequelize";
import logger from "../utils/logger";

const loggerLabel = "OAuth Service";

const OAuthLogin = (userId: number) => {
    const token = JWT.issueToken({
        userId,
    });
    logger.info(`User: ${userId} loggedin successfully`, {
        label: loggerLabel
    });
    return {
        message: "Login successful",
        token,
    };
};

const createUser = async (profile: GoogleProfile | GitHubProfile) =>{
    if (profile.emails?.length) {
        const email = profile.emails[0].value;
        let firstName: string;
        let lastName: string;
        if (profile.provider === "github") {
            const splitName = profile.displayName.trim().split(" ");
            firstName = splitName[0];
            lastName = splitName[splitName.length - 1];
        } else {
            firstName = profile.name?.givenName as string;
            lastName = profile.name?.familyName as string;
        }
        const [user, created] = await User.findOrCreate({
            where: {
                email,
                firstName,
                lastName,
                accountType: {
                    [Op.in]: [AccountType.APP, AccountType.SOCIAL]
                }
            },
            defaults: {
                email,
                firstName,
                lastName,
                accountType: AccountType.SOCIAL,
                statusId: status.ACTIVE
            }
        });
        if (created) {
            logger.info(`Created new user with Id: ${user.id}`, {
                label: loggerLabel
            });
        }
        if (!created && (user.statusId === status.DELETED || user.statusId === status.PENDING)) {
            user.statusId = status.ACTIVE;
            await user.save();
        }
        return user;
    } else {
        throw new Error("User not found");
    }
        
    
        
    
    
};

export default {
    OAuthLogin,
    createUser,
};