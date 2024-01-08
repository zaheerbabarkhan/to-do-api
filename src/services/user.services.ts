import config from "../config/config";
import { User } from "../database/models";
import { CreateUserReq, UserLoginRes, UserLoginReq } from "../types/user.types";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/http.error";
import httpStatus from "http-status";
import JWT from "../utils/jwt.util";
import EmailService from "../services/email.service";
import status from "../constants/status";
import { Payload } from "../types/jwt.types";
import { Op } from "sequelize";

const  createUser = async (userData: CreateUserReq): Promise<User>  => {
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

    await sendConfirmationEmail(newUser);
    
    return newUser;
};


const confirmUserEmail = async (token: string) => {
    const payload = await JWT.verify(String(token)) as Payload;
    console.log(payload);
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
    return {
        message: "Login successful",
        token,
    };
};

const sendConfirmationEmail = async (user: User) => {
    const emailConfirmationToken = JWT.issueToken({
        userId: user.id,
    });
    await EmailService.confirmationEmail(user.email, emailConfirmationToken);
};


export default {
    createUser,
    confirmUserEmail,
    userLogin,
};