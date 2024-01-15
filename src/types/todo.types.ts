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