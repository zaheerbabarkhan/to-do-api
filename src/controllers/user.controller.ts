import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.services";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await UserService.createUser(req.body);
        res.status(201).send(newUser);

    } catch (error) {
        next(error);
    }        
};



export const confirmUserEmail = async (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.query.token;

    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }
    
    try {
        await UserService.confirmUserEmail(String(token));
        res.status(200).json({
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
        res.status(200).json(responseBody);
    } catch (error) {
        next(error);
    }
    
};