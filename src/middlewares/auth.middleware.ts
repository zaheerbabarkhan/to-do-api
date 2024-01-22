import { NextFunction, Request, Response } from "express";
import { Payload } from "../types/jwt.types";
import JWT from "../utils/jwt.util";
import { User } from "../database/models";
import status from "../constants/status";
import { Op } from "sequelize"; 
import RedisService from "../services/redis.service";
import httpStatus from "http-status";

export default async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
   
    if (!token) {
        res.status(httpStatus.UNAUTHORIZED).json({
            message: "Unauthorized"
        });
        return;
    }
    
    let payload: Payload;
    try {
        payload = await JWT.verify(token) as Payload;
        const blacklistedToken = await RedisService.getUserToken(payload.userId);
        if (blacklistedToken && blacklistedToken === token) {
            res.status(httpStatus.UNAUTHORIZED).json({
                message: "Unauthorized"
            });
            return;
        }
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({
            message: "Unauthorized"
        });
        return;
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
        res.status(httpStatus.UNAUTHORIZED).json({
            message: "Unauthorized"
        });
        return;
    }

    if(user.statusId === status.PENDING) {
        res.status(httpStatus.UNAUTHORIZED).json({
            message: "You need to confirm your email first"
        });
        return;
    }

    res.locals.user = user;
    next();
};