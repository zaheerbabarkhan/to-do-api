import { NextFunction, Request, Response } from "express";
import TodoService from "../services/todo.service";
import { ToDoAttributes } from "../database/models";
import { Op, WhereOptions } from "sequelize";
import status from "../constants/status";

export const createToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const newToDo = await TodoService.createToDo({
            ...req.body,
            userId: res.locals.user.id
        });
        res.status(201).json(newToDo);
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
        const { query, statusId } = req.query;
        let whereClause: WhereOptions<ToDoAttributes> =  {
            userId: res.locals.user.id,
            statusId: {
                [Op.ne]: status.DELETED,
            },
        };
        if (query) {
            whereClause = {
                ...whereClause,
                [Op.or]: [{title: {
                    [Op.like]: `%${query}%`
                }},
                {description: {
                    [Op.like]: `%${query}%`
                }}]
            };
        }
        if (statusId) {
            whereClause = {
                ...whereClause,
                statusId: {
                    [Op.and]: [
                        {
                            [Op.ne]: status.DELETED
                        },
                        {
                            [Op.eq]: Number(statusId)
                        }
                    ]
                }
            };
        }
        
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
        const totalCounts = await TodoService.getToDoCounts(res.locals.user.id);
        res.status(200).json(totalCounts);
    } catch (error) {
        next(error);
    }
};


export const getPerDayCount = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const totalCounts = await TodoService.getPerDayCount(res.locals.user.id);
        res.status(200).json(totalCounts);
    } catch (error) {
        next(error);
    }
};

export const getOverdueTodoCount = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const totalCounts = await TodoService.getOverdueTodoCount(res.locals.user.id);
        res.status(200).json({
            overdueTodoCount: totalCounts,
        });
    } catch (error) {
        next(error);
    }
};

export const getDayWithMaxCompletedTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await TodoService.getDayWithMaxCompletedTasks(res.locals.user.id);
        res.status(200).json(results[0]);
    } catch (error) {
        next(error);
    } 
};



export const getAvgCompletedPerDay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const avg = await TodoService.getAvgCompletedPerDay(res.locals.user.id);
        res.status(200).json({
            avgCompletedPerDay: avg
        });
    } catch (error) {
        next(error);
    } 
};

export const getSimilars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TodoService.getSimilars(res.locals.user.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};