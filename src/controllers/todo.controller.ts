import { NextFunction, Request, Response } from "express";
import TodoService from "../services/todo.service";
import { User } from "../database/models";
import { UpdateToDoReq } from "../types/todo.types";

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

export const updateToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const reqData: UpdateToDoReq = req.body;
        const updatedToDo = await TodoService.updateToDo({
            ...reqData,
            user: res.locals.user
        });
        res.status(200).json(updatedToDo);
    } catch (error) {
        next(error);
    }
};