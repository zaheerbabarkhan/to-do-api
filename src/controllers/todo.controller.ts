import { NextFunction, Request, Response } from "express";
import TodoService from "../services/todo.service";
import { ToDoAttributes, User } from "../database/models";
import { UpdateToDoReq } from "../types/todo.types";
import { Op, WhereOptions } from "sequelize";
import status from "../constants/status";

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

export const getToDoById = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const id = Number(req.params.id);
        const todo = await TodoService.getToDoById(id);
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
};

export const getAllToDos = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const whereClause: WhereOptions<ToDoAttributes> =  {
            userId: res.locals.user.id,
            statusId: {
                [Op.ne]: status.DELETED,
            }
        };
        const allTodos = await TodoService.getAllToDos(whereClause);
        res.status(200).json(allTodos);
    } catch (error) {
        next(error);
    }
};

export const deleteToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const id = Number(req.params.id);
        await TodoService.deleteToDo(id);
        res.status(200).json({
            message: "To-Do deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

export const getToDoCounts = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const totalCounts = await TodoService.getToDoCounts(res.locals.user as User);
        res.status(200).json(totalCounts);
    } catch (error) {
        next(error);
    }
};