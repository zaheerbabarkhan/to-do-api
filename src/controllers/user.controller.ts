import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.services";
import redis from "../database/redis";
import httpStatus from "http-status";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await UserService.createUser(req.body);
        res.status(httpStatus.CREATED).send(newUser);

    } catch (error) {
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
        next(error);
    }
    
};


export const  userLogout = async (req: Request, res: Response, next: NextFunction) => { 
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(httpStatus.UNAUTHORIZED).json({
            message: "Unauthorized"
        });
        return;
    }
    redis.sAdd()
}