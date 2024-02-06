import config from "../config/config";
import { User } from "../database/models";
import { CreateUserReq, UserLoginRes, UserLoginReq, AccountType, CreateUserRes } from "../types/user.types";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/http.error";
import httpStatus from "http-status";
import JWT from "../utils/jwt.util";
import EmailService from "../services/email.service";
import status from "../constants/status";
import { Payload } from "../types/jwt.types";
import { Op } from "sequelize";
import { JwtPayload } from "jsonwebtoken";
import RedisService from "./redis.service";
import logger from "../utils/logger";

const loggerLabel = "User Service";
const  createUser = async (userData: CreateUserReq, issueToken = JWT.issueToken, sendConfirmationEmail = EmailService.confirmationEmail): Promise<CreateUserRes>  => {
    const {firstName, lastName, email, password} = userData;
    
    const userExist = await User.count({
        where: {
            email,
        }
    });
    
    if (userExist) {
        throw new HttpError(httpStatus.BAD_REQUEST, "Email already registered");
    }
    
    const passwordHash = await bcrypt.hash(password, config.BCRYPT.SALT_ROUNDS);
    
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
    });
    logger.info(`Created new user with Id: ${newUser.id}`, {
        label: loggerLabel
    });
    const emailConfirmationToken = issueToken({
        userId: newUser.id,
    });
    let emailSuccessMessage = "Confirmation email sent successfully.";
    try {
        await sendConfirmationEmail(newUser.email, emailConfirmationToken);
    } catch (error) {
        logger.error(`Error occured while sending email confirmation error: ${JSON.stringify(error)}`, {
            label: loggerLabel
        });
        emailSuccessMessage = "Confirmation email failed. Please provide a valid email or contact support."; 
    }
    
    return {
        user: newUser,
        message: emailSuccessMessage
    };
};


const confirmUserEmail = async (token: string) => {
    let payload: Payload;
    try {
        payload = await JWT.verify(String(token)) as Payload;
    } catch (error) {
        throw new HttpError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const user = await User.findOne({
        where: {
            id: payload.userId,
            statusId: {
                [Op.ne]: status.DELETED,
            },
        }
    });

    if (!user) {
        throw new HttpError(httpStatus.NOT_FOUND, "User not found");
    }

    if(user.statusId === status.ACTIVE) {
        throw new HttpError(httpStatus.BAD_REQUEST, "Email confirmed already");
    }
    logger.info(`User: ${user.id} email confirmed successfully`, {
        label: loggerLabel
    });
    user.statusId = status.ACTIVE;
    await user.save();
};

const userLogin = async(loginData: UserLoginReq): Promise<UserLoginRes> => {
    const user = await User.findOne({
        where: {
            email: loginData.email,
            statusId: {
                [Op.ne]: status.DELETED,
            },
        },
    });
    if (!user) {
        throw new HttpError(httpStatus.BAD_REQUEST, "Invalid credentials.");
    }
    if(user.statusId === status.PENDING) {
        throw new HttpError(httpStatus.BAD_REQUEST, "Confirm your email please");
    }
    const isPasswordCorrect =  bcrypt.compareSync(loginData.password, user.password);
    if (!isPasswordCorrect) {
        throw new HttpError(httpStatus.BAD_REQUEST, "Invalid credentials.");
    }
    const token = JWT.issueToken({
        userId: user.id
    });
    logger.info(`User: ${user.id} loggedin successfully`, {
        label: loggerLabel
    });
    return {
        message: "Login successful",
        token,
    };
};


const userLogout = async (userId: number, token: string) => {
    const jwtData = JWT.decode(token) as JwtPayload;
    const expiryTimeLeft = Math.floor(Math.abs( jwtData.payload.exp - (Date.now() /1000)));
    await RedisService.storeUserToken(token, userId, expiryTimeLeft);
    logger.info(`User: ${jwtData.payload.userId} loggedout successfully`, {
        label: loggerLabel
    });
    return {
        message: "User logged out",
    };

    
};

const forgotPassword = async (email: string) => {
    const user = await User.findOne({
        where: {
            email,
            statusId: {
                [Op.ne]: [status.DELETED] 
            },
            accountType: AccountType.APP
        }
    });
    if (!user) {
        throw new HttpError(httpStatus.BAD_REQUEST, "No user found");
    }
    const token = JWT.issueToken({
        userId: user.id,
    });
    logger.info(`User: ${user.id} requested forgot password`, {
        label: loggerLabel
    });
    await EmailService.forgotPasswordEmail(user.email, token);
    logger.info(`User: ${user.id} forgot password email sent`, {
        label: loggerLabel
    });
};   

const newPassword = async (userId: string, password: string) => {
    const passwordHash = await bcrypt.hash(password, config.BCRYPT.SALT_ROUNDS);
    User.update({
        password: passwordHash
    }, {
        where: {
            id: userId,
        }
    });
    logger.info(`User: ${userId} password updated`, {
        label: loggerLabel
    });
};
export default {
    createUser,
    confirmUserEmail,
    userLogin,
    userLogout,
    forgotPassword,
    newPassword,
};