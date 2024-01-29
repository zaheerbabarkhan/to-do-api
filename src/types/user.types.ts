import { User } from "../database/models";

export interface CreateUserReq {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface CreateUserRes {
    user: User,
    message: string
}
export interface UserLoginReq {
    email: string;
    password: string;
}

export interface UserLoginRes {
    message: string;
    token: string;
}


export enum AccountType {
    SOCIAL = "SOCIAL",
    APP = "APP",
}

