import { User } from "../database/models";

export interface CreateToDoReq {
    title: string;
    description?: string;
    dueDate: Date;
    user: User;
}


export interface UpdateToDoReq {
    title?: string;
    description?: string;
    dueDate?: Date
    markCompleted?: boolean;
    user: User
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