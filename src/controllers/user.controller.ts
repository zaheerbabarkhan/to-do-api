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