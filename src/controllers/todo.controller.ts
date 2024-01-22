import { NextFunction, Request, Response } from "express";
import TodoService from "../services/todo.service";
import { ToDoAttributes } from "../database/models";
import { Op, WhereOptions } from "sequelize";
import status from "../constants/status";
import httpStatus from "http-status";

export const createToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const newToDo = await TodoService.createToDo({
            ...req.body,
            userId: res.locals.user.id
        });
        res.status(httpStatus.CREATED).json(newToDo);
        return;
    } catch (error) {
        next(error);
    }
};

export const updateToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        
        const updatedToDo = await TodoService.updateToDo({
            ...req.body,
            userId: res.locals.user.id
        });
        res.status(httpStatus.OK).json(updatedToDo);
    } catch (error) {
        next(error);
    }
};

export const getToDoById = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const id = Number(req.params.id);
        const todo = await TodoService.getToDoById(id);
        res.status(httpStatus.OK).json(todo);
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
        res.status(httpStatus.OK).json(allTodos);
    } catch (error) {
        next(error);
    }
};

export const deleteToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const id = Number(req.params.id);
        await TodoService.deleteToDo(id);
        res.status(httpStatus.OK).json({
            message: "To-Do deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

export const getToDoCounts = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const totalCounts = await TodoService.getToDoCounts(res.locals.user.id);
        res.status(httpStatus.OK).json(totalCounts);
    } catch (error) {
        next(error);
    }
};


export const getPerDayCount = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const totalCounts = await TodoService.getPerDayCount(res.locals.user.id);
        res.status(httpStatus.OK).json(totalCounts);
    } catch (error) {
        next(error);
    }
};

export const getOverdueTodoCount = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const totalCounts = await TodoService.getOverdueTodoCount(res.locals.user.id);
        res.status(httpStatus.OK).json({
            overdueTodoCount: totalCounts,
        });
    } catch (error) {
        next(error);
    }
};

export const getDayWithMaxCompletedTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await TodoService.getDayWithMaxCompletedTasks(res.locals.user.id);
        res.status(httpStatus.OK).json(results[0]);
    } catch (error) {
        next(error);
    } 
};



export const getAvgCompletedPerDay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const avg = await TodoService.getAvgCompletedPerDay(res.locals.user.id);
        res.status(httpStatus.OK).json({
            avgCompletedPerDay: avg
        });
    } catch (error) {
        next(error);
    } 
};

export const getSimilars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TodoService.getSimilars(res.locals.user.id);
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
};