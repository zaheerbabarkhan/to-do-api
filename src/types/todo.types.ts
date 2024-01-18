import { WhereOptions } from "sequelize";

export interface CreateToDoReq {
    title: string;
    description?: string;
    dueDate: Date;
    userId: string;
}


export interface UpdateToDoReq {
    title?: string;
    description?: string;
    dueDate?: Date
    markCompleted?: boolean;
    userId: string
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
}