import { Order, WhereOptions, IncludeOptions } from "sequelize";

export interface CreateToDoReq {
    title: string;
    description?: string;
    dueDate: Date;
    userId: string;
    files?: string[];
}


export interface UpdateToDoReq {
    title?: string;
    description?: string;
    dueDate?: Date
    markCompleted?: boolean;
    userId: number;
    todoId: number,
    files?: string[]
}

export interface ToDOCountsRes {
    totalCompleted: number;
    totalPending: number;
    totalCount: number;
}


export interface ToDoPerDayCountRes {
    dayOfWeek: number;
    countPerDay: number
}


export interface DayWithTasksRes {
    day: Date,
    countPerDay: number;
}

export interface SimilarsQueryResult {
    title: number;
    ids: string
}


export interface GetAllToDos {
    where: WhereOptions,
    attributes?: string[],
    order?: Order,
    include: IncludeOptions,
}