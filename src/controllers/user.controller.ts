import { NextFunction, Request, Response } from "express";
import { User } from "../database/models";
import bcrypt from "bcrypt";
import config from "../config/config";
import { HttpError } from "../errors/http.error";
import httpStatus from "http-status";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    
    const {firstName, lastName, email, password} = req.body;

    const userExist = await User.count({
        where: {
            email,
        }
    });

    if (userExist) {
        next(new HttpError(httpStatus.BAD_REQUEST, "Email already registered"));
        return;
    }

    const passwordHash = await bcrypt.hash(password, config.BCRYPT.SALT_ROUNDS);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
    });
    res.status(201).send(newUser);
};