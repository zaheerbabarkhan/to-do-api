import { NextFunction, Request, Response } from "express";
import OAuthsService from "../services/OAuths.service";
import { User } from "../database/models";
import httpStatus from "http-status";
import logger from "../utils/logger";
import { HttpError } from "../errors/http.error";

const loggerLabel = "OAuth Controller";
export const OAUTHLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user) {
            const user = req.user as User;
            const tokenResponse = OAuthsService.OAuthLogin(user.id);
            res.status(httpStatus.OK).json(tokenResponse);
        }
        else {
            res.status(httpStatus.NOT_FOUND).send("User not found");
        }
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
    
};

