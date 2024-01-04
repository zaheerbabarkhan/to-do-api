import { Request, Response } from "express";
import { User } from "../database/models";
import bcrypt from "bcrypt";
import config from "../config/config";

export const createUser = async (req: Request, res: Response) => {
    
    const {firstName, lastName, email, password} = req.body;

    const passwordHash = await bcrypt.hash(password, config.BCRYPT.SALT_ROUNDS);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
    });
    res.status(201).send(newUser);
};