import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.services";
import httpStatus from "http-status";
import logger from "../utils/logger";
import { HttpError } from "../errors/http.error";

const loggerLabel = "User Controller";
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await UserService.createUser(req.body);
        res.status(httpStatus.CREATED).send(newUser);

    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }        
};



export const confirmUserEmail = async (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.query.token;

    if (!token) {
        res.status(httpStatus.UNAUTHORIZED).json({
            message: "Unauthorized"
        });
        return;
    }
    
    try {
        await UserService.confirmUserEmail(String(token));
        res.status(httpStatus.OK).json({
            message: "Email confirmed successfully."
        });
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
    
};


export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    const {email, password} = req.body;
    try {
        const responseBody = await UserService.userLogin({
            email,
            password,
        });
        res.status(httpStatus.OK).json(responseBody);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
    
};


export const  userLogout = async (req: Request, res: Response, next: NextFunction) => { 
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const logOutResponse = await UserService.userLogout(res.locals.user.id, String(token));
        res.status(httpStatus.OK).send(logOutResponse);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserService.forgotPassword(req.body.email);
        res.status(httpStatus.OK).json({
            message: "please check your email",
        });
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};

export const newPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserService.newPassword(res.locals.user.id, req.body.newPassword);
        res.status(httpStatus.OK).json({
            message: "password updated",
        });
    } catch (error) {
        next(error);
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
    }
};