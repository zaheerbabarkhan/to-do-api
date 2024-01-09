import { NextFunction, Request, Response } from "express";
import { Payload } from "../types/jwt.types";
import JWT from "../utils/jwt.util";
import { User } from "../database/models";
import status from "../constants/status";
import { Op } from "sequelize"; 

export default async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
   
    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    let payload: Payload;
    try {
        payload = await JWT.verify(token.split(" ")[1]) as Payload;
    } catch (error) {
        res.status(401).json({
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
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    if(user.statusId === status.PENDING) {
        res.status(401).json({
            message: "You need to confirm your email first"
        });
        return;
    }

    res.locals.user = user;
    next();
};