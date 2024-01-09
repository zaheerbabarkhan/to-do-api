import { User } from "../database/models";

export interface CreateToDoReq {
    title: string;
    description?: string;
    dueDate: Date;
    user: User;
}