import { NextFunction, Request, Response } from "express";
import OAuthsService from "../services/OAuths.service";
import { User } from "../database/models";
import httpStatus from "http-status";

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user) {
            const user = req.user as User;
            const tokenResponse = OAuthsService.googleLogin(user.id);
            res.status(httpStatus.OK).json(tokenResponse);
        }
        else {
            res.status(httpStatus.NOT_FOUND).send("User not found");
        }
    } catch (error) {
        next(error);
    }
    
};

