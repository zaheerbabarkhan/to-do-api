import { NextFunction, Request, Response } from "express";
import TodoService from "../services/todo.service";
import s3Service from "../services/s3.service";
import httpStatus from "http-status";
import { HttpError } from "../errors/http.error";
import logger from "../utils/logger";

const loggerLabel = "Todo Controller";
export const createToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const newToDo = await TodoService.createToDo({
            ...req.body,
            userId: res.locals.user.id
        });
        res.status(httpStatus.CREATED).json(newToDo);
        return;
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};

export const updateToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        
        const updatedToDo = await TodoService.updateToDo({
            ...req.body,
            userId: res.locals.user.id,
            todoId: Number(req.params.id)
        });
        res.status(httpStatus.OK).json(updatedToDo);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};

export const getToDoById = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const id = Number(req.params.id);
        const todo = await TodoService.getToDoById(id);
        res.status(httpStatus.OK).json(todo);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};

export const getAllToDos = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const queryClause = TodoService.getQueryClauseForAllToDos(req, res.locals.user.id);
        const allTodos = await TodoService.getAllToDos(queryClause);
        res.status(httpStatus.OK).json(allTodos);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: "Get All Todos"
            });
        }
        next(error);
    }
};

export const deleteToDo = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const id = Number(req.params.id);
        await TodoService.deleteToDo(id, res.locals.user.id);
        res.status(200).json({
            message: "To-Do deleted successfully."
        });
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};

export const getToDoCounts = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const totalCounts = await TodoService.getToDoCounts(res.locals.user.id);
        res.status(httpStatus.OK).json(totalCounts);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};


export const getPerDayCount = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const totalCounts = await TodoService.getPerDayCount(res.locals.user.id);
        res.status(httpStatus.OK).json(totalCounts);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
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
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};

export const getDayWithMaxCompletedTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await TodoService.getDayWithMaxCompletedTasks(res.locals.user.id);
        res.status(httpStatus.OK).json(results[0]);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
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
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    } 
};

export const getSimilars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TodoService.getSimilars(res.locals.user.id);
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};

export const getSignedURLForUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const signedUrl = await s3Service.presignedUpload(req.body.fileName, req.body.fileType, `todo/${res.locals.user.id}`);
        res.status(httpStatus.OK).json(signedUrl);
    } catch (error) {
        if(!(error instanceof HttpError)) {
            logger.error(JSON.stringify(error), {
                label: loggerLabel
            });
        }
        next(error);
    }
};