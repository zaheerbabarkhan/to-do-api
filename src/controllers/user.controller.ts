import { Request, Response } from "express";


export const createUser = (req: Request, res: Response) => {
    console.log(req.body);
    const body = req.body;
    res.send(body);
};