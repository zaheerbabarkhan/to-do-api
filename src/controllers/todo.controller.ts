import { NextFunction, Request, Response } from "express";
import TodoService from "../services/todo.service";
import { User } from "../database/models";

export const createToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const newToDo = await TodoService.createToDo({
            ...req.body,
            user: res.locals.user as User
        });
        res.status(201).json(newToDo);
        return;
    } catch (error) {
        next(error);
    }
};