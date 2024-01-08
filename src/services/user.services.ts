import config from "../config/config";
import { User } from "../database/models";
import { CreateUser } from "../types/user.types";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/http.error";
import httpStatus from "http-status";
import JWT from "../utils/jwt.util";
import EmailService from "../services/email.service";

const  createUser = async (userData: CreateUser): Promise<User>  => {
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

const sendConfirmationEmail = async (user: User) => {
    const emailConfirmationToken = JWT.issueToken({
        userId: user.id,
    });
    await EmailService.confirmationEmail(user.email, emailConfirmationToken);
};


export default {
    createUser,
};